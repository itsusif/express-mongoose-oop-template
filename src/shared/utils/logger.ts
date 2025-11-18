import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { Config } from '../config';

export class Logger {
  private static instance: winston.Logger;

  private constructor() {}

  public static getInstance(): winston.Logger {
    if (!Logger.instance) {
      const transports: winston.transport[] = [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.printf(
              (info) => `${info.timestamp} ${info.level}: ${info.message}`
            )
          ),
        }),
      ];

      // Add file transport only in production
      if (Config.NODE_ENV === 'production') {
        transports.push(
          new DailyRotateFile({
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d',
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.json()
            ),
          })
        );
      }

      Logger.instance = winston.createLogger({
        level: Config.NODE_ENV === 'development' ? 'debug' : 'info',
        format: winston.format.json(),
        transports,
      });
    }

    return Logger.instance;
  }
}