import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';

export abstract class BaseValidation {
  public async validate(
    zodSchema: z.ZodSchema,
    value: any,
  ): Promise<z.infer<typeof zodSchema>> {
    const { data, success, error } = await zodSchema.safeParseAsync(value);
    if (!success)
      throw new BadRequestException({
        ...error.formErrors.fieldErrors,
        VALIDATION: 'VALIDATION ERROR',
      });

    return data as z.infer<typeof zodSchema>;
  }
}
