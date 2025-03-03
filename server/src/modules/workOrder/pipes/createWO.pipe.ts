import {
  type ArgumentMetadata,
  Injectable,
  type PipeTransform,
} from '@nestjs/common';
import { BaseValidation } from 'src/base/validation.base';
import {
  INVALID_TYPE_ERROR,
  MAX_ERROR,
  MIN_ERROR,
  REQUIRED_ERROR,
  UUID_ERROR,
} from 'src/constants/error.constant';
import { z } from 'zod';

const schema = z.object({
  name: z
    .string({
      required_error: REQUIRED_ERROR,
      invalid_type_error: INVALID_TYPE_ERROR,
    })
    .min(2, { message: MIN_ERROR(2) })
    .transform((val) => val.trim()),
  amount: z.coerce
    .number({
      required_error: REQUIRED_ERROR,
      invalid_type_error: INVALID_TYPE_ERROR,
    })
    .min(1, { message: MIN_ERROR(1) })
    .max(999, { message: MAX_ERROR(999) }),
  deadline: z.coerce
    .date({
      required_error: REQUIRED_ERROR,
      invalid_type_error: INVALID_TYPE_ERROR,
    })
    .refine(
      (val) => val.getTime() > Date.now(),
      'deadline must be in the future',
    ),
  operatorId: z
    .string({
      required_error: REQUIRED_ERROR,
      invalid_type_error: INVALID_TYPE_ERROR,
    })
    .uuid({ message: UUID_ERROR }),
});

export type ICreateWoSchema = z.infer<typeof schema>;

@Injectable()
export class CreateWOPipe
  extends BaseValidation
  implements PipeTransform<any, Promise<ICreateWoSchema>>
{
  public async transform(value: any, _: ArgumentMetadata) {
    return await this.validate(schema, value);
  }
}
