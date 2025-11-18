import mongoose from 'mongoose';

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy';
  uptime: number;
  timestamp: string;
  environment: string;
  database: {
    status: 'connected' | 'disconnected';
    name: string;
  };
  memory: {
    heapUsed: string;
    heapTotal: string;
    rss: string;
    external: string;
  };
  cpu: {
    user: number;
    system: number;
  };
}

/**
 * Health check utility for monitoring service status
 */
export class HealthCheck {
  /**
   * Get detailed health status of the application
   */
  public static async getHealth(): Promise<HealthCheckResult> {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    return {
      status: await this.getOverallStatus(),
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: await this.getDatabaseHealth(),
      memory: {
        heapUsed: this.formatBytes(memoryUsage.heapUsed),
        heapTotal: this.formatBytes(memoryUsage.heapTotal),
        rss: this.formatBytes(memoryUsage.rss),
        external: this.formatBytes(memoryUsage.external),
      },
      cpu: {
        user: cpuUsage.user / 1000000, // Convert to seconds
        system: cpuUsage.system / 1000000,
      },
    };
  }

  /**
   * Check if database is connected
   */
  private static async getDatabaseHealth(): Promise<{ status: 'connected' | 'disconnected'; name: string }> {
    const isConnected = mongoose.connection.readyState === 1;
    return {
      status: isConnected ? 'connected' : 'disconnected',
      name: mongoose.connection.name || 'unknown',
    };
  }

  /**
   * Get overall health status
   */
  private static async getOverallStatus(): Promise<'healthy' | 'unhealthy'> {
    const dbHealth = await this.getDatabaseHealth();
    return dbHealth.status === 'connected' ? 'healthy' : 'unhealthy';
  }

  /**
   * Format bytes to human-readable string
   */
  private static formatBytes(bytes: number): string {
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(2)} MB`;
  }

  /**
   * Simple liveness check
   */
  public static async isAlive(): Promise<boolean> {
    return true;
  }

  /**
   * Readiness check - is the service ready to handle requests?
   */
  public static async isReady(): Promise<boolean> {
    const dbHealth = await this.getDatabaseHealth();
    return dbHealth.status === 'connected';
  }
}
