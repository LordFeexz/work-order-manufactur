import {
  type ArgumentMetadata,
  Injectable,
  type PipeTransform,
} from '@nestjs/common';
import { BaseValidation } from 'src/base/validation.base';
import { INVALID_TYPE_ERROR } from 'src/constants/error.constant';
import { z } from 'zod';

@Injectable()
export class TypePipe extends BaseValidation implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    return (
      await this.validate(
        z.object({
          [metadata.data]: z?.[this.type]?.({
            invalid_type_error: INVALID_TYPE_ERROR,
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
