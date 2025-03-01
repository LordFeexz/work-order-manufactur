import { z } from "zod";

export const loginSchema = z.object({
  username: z.string({ required_error: "username is required" }),
  password: z.string({ required_error: "password is required" }),
});

export type ILoginSchema = z.infer<typeof loginSchema>;

export type ILoginState = ILoginSchema & {
  errors: z.ZodError<ILoginSchema>["formErrors"]["fieldErrors"];
  error?: string;
  token?: string;
};
