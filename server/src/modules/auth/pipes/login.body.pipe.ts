import {
  type ArgumentMetadata,
  Injectable,
  type PipeTransform,
} from '@nestjs/common';
import { BaseValidation } from 'src/base/validation.base';
import {
  INVALID_TYPE_ERROR,
  REQUIRED_ERROR,
} from 'src/constants/error.constant';
import { z } from 'zod';

const schema = z.object({
  username: z.string({
    required_error: REQUIRED_ERROR,
    invalid_type_error: INVALID_TYPE_ERROR,
  }),
  password: z.string({
    required_error: REQUIRED_ERROR,
    invalid_type_error: INVALID_TYPE_ERROR,
  }),
});

export type ILoginBodySchema = z.infer<typeof schema>;

@Injectable()
export class LoginBodyPipe
  extends BaseValidation
  implements PipeTransform<any, Promise<ILoginBodySchema>>
{
  public async transform(value: any, _: ArgumentMetadata) {
    return await this.validate(schema, value);
  }
}
