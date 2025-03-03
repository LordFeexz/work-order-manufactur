import {
  type ArgumentMetadata,
  Injectable,
  type PipeTransform,
} from '@nestjs/common';
import { BaseValidation } from 'src/base/validation.base';
import { z } from 'zod';

@Injectable()
export class RequiredFieldPipe<T>
  extends BaseValidation
  implements PipeTransform<any, Promise<T>>
{
  public async transform(value: T, metadata: ArgumentMetadata) {
    const schema = z.object({
      [metadata.data]: z.any().refine((val) => !!val, {
        message: `${metadata.data} is required`,
      }),
    });

    return (await this.validate(schema, { [metadata.data]: value }))[
      metadata.data
    ];
  }
}
