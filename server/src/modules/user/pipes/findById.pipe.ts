import {
  type ArgumentMetadata,
  Injectable,
  type PipeTransform,
} from '@nestjs/common';
import { UserService } from '../user.service';

@Injectable()
export class UserFindByIdPipe implements PipeTransform {
  public async transform(value: string, _: ArgumentMetadata) {
    return await this.userService.findById(value, { raw: true });
  }

  constructor(private readonly userService: UserService) {}
}
