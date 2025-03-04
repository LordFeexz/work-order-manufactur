import { WORK_ORDER_STATUS } from "@/interfaces/model";
import { z } from "zod";

export const getWorkOrderDatasSchemaQuery = z.object({
  page: z.coerce.number().min(1).max(100).default(1).nullable().optional(),
  limit: z.coerce.number().min(10).max(100).default(10).nullable().optional(),
  q: z.string().nullable().optional(),
  status: z
    .enum(["", ...Object.values(WORK_ORDER_STATUS)])
    .default("")
    .optional()
    .nullable(),
  operator_id: z.string().uuid().optional().nullable(),
});

export type IGetWorkOrderDatasSchemaQuery = z.infer<
  typeof getWorkOrderDatasSchemaQuery
>;
