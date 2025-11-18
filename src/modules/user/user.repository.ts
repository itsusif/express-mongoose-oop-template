import { BaseRepository } from '../../shared/database/BaseRepository';
import { UserModel, IUser } from '../../shared/database/models/User.model';

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(UserModel);
  }

  async findActiveUsers(): Promise<IUser[]> {
    return await this.model.find({ isActive: true }).exec();
  }
}