import { WORK_ORDER_STATUSES } from 'src/models/work_orders';
import { z } from 'zod';
import { GetWorkOrderData } from './dto/get.dto';

export const getWorkOrderSchema = {
  q: z.string().default(null).optional().nullable(),
  status: z
    .enum([null, ...WORK_ORDER_STATUSES])
    .default(null)
    .optional()
    .nullable(),
  operator_id: z.string().uuid().default(null).optional().nullable(),
};

export const getWorkOrderSchemaObject = z.object(getWorkOrderSchema);

export type IGetWorkOrderSchema = z.infer<typeof getWorkOrderSchemaObject>;

export interface IGetWorkOrderQueryResult {
  datas: GetWorkOrderData[];
  total: number;
}
