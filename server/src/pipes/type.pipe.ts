import {
  type ArgumentMetadata,
  Injectable,
  type PipeTransform,
} from '@nestjs/common';
import { BaseValidation } from 'src/base/validation.base';
import { z } from 'zod';

@Injectable()
export class TypePipe extends BaseValidation implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    return (
      await this.validate(
        z.object({
          [metadata.data]: z?.[this.type]?.({
            invalid_type_error: 'invalid type',
          }),
        }),
        { [metadata.data]: value },
      )
    )[metadata.data];
  }

  constructor(private readonly type: 'string' | 'number' | 'boolean') {
    super();
  }
}
