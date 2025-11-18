import { BaseRepository } from '../../shared/database/BaseRepository';
import { UserModel, IUser } from '../../shared/database/models/User.model';

export class AuthRepository extends BaseRepository<IUser> {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.model.findOne({ email }).select('+password').exec();
  }

  async emailExists(email: string): Promise<boolean> {
    const count = await this.model.countDocuments({ email }).exec();
    return count > 0;
  }
}