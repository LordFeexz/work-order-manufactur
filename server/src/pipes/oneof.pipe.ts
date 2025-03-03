import {
  type ArgumentMetadata,
  Injectable,
  type PipeTransform,
} from '@nestjs/common';
import { BaseValidation } from 'src/base/validation.base';
import { ONE_OF_ERROR } from 'src/constants/error.constant';
import { z } from 'zod';

@Injectable()
export class OneOfPipe<T extends string | number>
  extends BaseValidation
  implements PipeTransform
{
  public async transform(value: T, metadata: ArgumentMetadata) {
    return (
      await this.validate(
        z.object({
          [metadata.data]: z
            .custom<T>((val) => this.values.includes(val as T), {
              message: ONE_OF_ERROR(this.values),
            })
            .nullable()
            .optional(),
        }),
        { [metadata.data]: value },
      )
    )[metadata.data];
  }

  constructor(private readonly values: T[]) {
    super();
  }
}
