import {
  type ArgumentMetadata,
  Injectable,
  type PipeTransform,
} from '@nestjs/common';
import { UserService } from '../user.service';
import { Transaction } from 'sequelize';

@Injectable()
export class UserFindByIdLockedPipe implements PipeTransform {
  public async transform(value: string, _: ArgumentMetadata) {
    return await this.userService.findById(value, {
      raw: true,
      lock: Transaction.LOCK.UPDATE,
    });
  }

  constructor(private readonly userService: UserService) {}
}
