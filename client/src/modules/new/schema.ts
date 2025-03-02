import { z } from "zod";

export const newWorkOrderSchema = z.object({
  name: z.string({
    required_error: "name is required",
    invalid_type_error: "name must be a string",
  }),
  amount: z
    .number({
      required_error: "amount is required",
      invalid_type_error: "amount must be a number",
    })
    .refine(
      (val) => !isNaN(parseInt(val.toString())),
      "amount must be a number"
    ),
  time: z
    .date({
      required_error: "time is required",
      invalid_type_error: "time must be a date",
    })
    .min(new Date(), "time must be in the future")
    .max(new Date(), "time must be in the past")
    .refine(
      (val) => val instanceof Date && isNaN(val.getTime()),
      "time must be a date"
    ),
  operatorId: z
    .string({
      required_error: "operatorId is required",
      invalid_type_error: "operatorId must be a string",
    })
    .uuid("operatorId must be a valid uuid"),
});

export type INewWorkOrderSchema = z.infer<typeof newWorkOrderSchema>;

export type INewWorkOrderState = INewWorkOrderSchema & {
  errors: z.ZodError<INewWorkOrderSchema>["formErrors"]["fieldErrors"];
  error?: string;
};
