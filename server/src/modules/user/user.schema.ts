import { z } from 'zod';
import type { GetUserDto } from './dto/get.dto';

export const getOperatorSchema = {
  q: z.string().default(null).optional().nullable(),
};

export const getOperatorSchemaObject = z.object(getOperatorSchema);

export type IGetOperatorSchema = z.infer<typeof getOperatorSchemaObject>;

export interface GetUserQueryResult {
  datas: GetUserDto[];
  total: number;
}
