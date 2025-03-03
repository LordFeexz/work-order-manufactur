import { z } from "zod";

export const newWorkOrderSchema = z.object({
  name: z.string({
    required_error: "name is required",
    invalid_type_error: "name must be a string",
  }),
  amount: z.coerce
    .number({
      required_error: "amount is required",
      invalid_type_error: "amount must be a number",
    })
    .refine(
      (val) => !isNaN(parseInt(val.toString())),
      "amount must be a number"
    ),
  deadline: z.coerce
    .date({
      required_error: "deadline is required",
      invalid_type_error: "deadline must be a date",
    })
    .refine(
      (val) => val.getTime() > Date.now(),
      "deadline must be in the future"
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
