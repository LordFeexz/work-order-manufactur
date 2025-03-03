import {
  type ArgumentMetadata,
  Injectable,
  type PipeTransform,
} from '@nestjs/common';
import { BaseValidation } from 'src/base/validation.base';
import { REQUIRED_ERROR } from 'src/constants/error.constant';
import { z } from 'zod';

@Injectable()
export class RequiredFieldPipe<T>
  extends BaseValidation
  implements PipeTransform<any, Promise<T>>
{
  public async transform(value: T, metadata: ArgumentMetadata) {
    const schema = z.object({
      [metadata.data]: z.any().refine((val) => !!val, {
        message: REQUIRED_ERROR,
      }),
    });

    return (await this.validate(schema, { [metadata.data]: value }))[
      metadata.data
    ];
  }
}
