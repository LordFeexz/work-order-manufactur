"use server";

import { request } from "@/libs/request";
import { loginSchema, type ILoginState } from "./schema";
import type { IRespBody } from "@/interfaces/response";

export async function loginAction(prevState: ILoginState, formData: FormData) {
  const { error, success, data } = await loginSchema.safeParseAsync({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!success)
    return {
      ...prevState,
      errors: error.formErrors.fieldErrors,
    };

  try {
    const response = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok)
      return {
        ...prevState,
        error: "something went wrong",
      };

    const { data: token, message } =
      (await response.json()) as IRespBody<string>;

    return response.status === 200
      ? { ...prevState, token }
      : { ...prevState, error: message };
  } catch (err) {
    return { ...prevState, error: "unexpected error" };
  }
}
