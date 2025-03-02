import {
  type ArgumentMetadata,
  Injectable,
  type PipeTransform,
} from '@nestjs/common';
import { BaseValidation } from 'src/base/validation.base';
import { z } from 'zod';

export type IBaseQuery<T extends Record<string, any> = {}> = {
  page: number;
  limit: number;
} & T;

@Injectable()
export class QueryPipe<T extends Record<string, any> = {}>
  extends BaseValidation
  implements PipeTransform<any, Promise<IBaseQuery<T>>>
{
  private readonly schema: z.ZodRawShape;
  private readonly page: number;
  private readonly limit: number;

  public async transform(value: any, _: ArgumentMetadata) {
    return await this.validate(
      z.object({
        page: z.coerce
          .number()
          .min(1, { message: 'page must be greater than 0' })
          .default(this.page)
          .transform((val) => Number(val)),
        limit: z.coerce
          .number()
          .min(1, { message: 'limit must be greater than 0' })
          .max(999, { message: 'limit must be less than 999' })
          .default(this.limit)
          .transform((val) => Number(val)),
        ...this.schema,
      }),
      value,
    );
  }

  constructor(page: number, limit: number, schema: z.ZodRawShape = {}) {
    super();
    this.page = page;
    this.limit = limit;
    this.schema = schema;
  }
}
