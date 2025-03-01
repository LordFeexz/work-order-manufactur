import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions } from 'sequelize';
import { type IUserAttributes, User } from 'src/models/users';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private model: typeof User) {}

  public async findByUsername(
    username: string,
    opts?: Omit<FindOptions<IUserAttributes>, 'where'>,
  ) {
    return this.model.findOne({ ...opts, where: { username } });
  }
}
