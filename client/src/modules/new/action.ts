"use server";

import { request } from "@/libs/request";
import { newWorkOrderSchema, type INewWorkOrderState } from "./schema";
import { getServerSideSession } from "@/libs/session";
import { redirect } from "next/navigation";
import type { IRespBody } from "@/interfaces/response";
import type { IUserData } from "@/interfaces/model";
import { revalidateTag } from "next/cache";
import { DASHBOARD_WORK_ORDERS_CACHE } from "@/constants/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function createWorkOrderAction(
  prevState: INewWorkOrderState,
  formData: FormData
) {
  const session = await getServerSideSession();
  if (!session || !session.user?.access_token) redirect("/login");

  const { data, success, error } = await newWorkOrderSchema.safeParseAsync({
    name: formData.get("name"),
    amount: formData.get("amount"),
    deadline: formData.get("deadline"),
    operatorId: formData.get("operatorId"),
  });

  if (!success) return { ...prevState, errors: error.formErrors.fieldErrors };

  try {
    const response = await request("/work-orders", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.access_token}`,
      },
    });

    if (!response.ok)
      return {
        ...prevState,
        error: "something went wrong",
      };

    revalidateTag(DASHBOARD_WORK_ORDERS_CACHE);
    redirect("/");
  } catch (err) {
    if (isRedirectError(err)) throw err;

    return { ...prevState, error: "unexpected error" };
  }
}

export async function getOperatorData() {
  const session = await getServerSideSession();
  if (!session || !session?.user?.access_token) redirect("/login");

  try {
    const response = await request("/users", {
      method: "GET",
      headers: {
        authorization: `Bearer ${session?.user?.access_token}`,
      },
      query: { page: "1", limit: "100" },
    });

    if (!response.ok) return [];

    const { data = [] } = (await response.json()) as IRespBody<IUserData[]>;

    return data;
  } catch (err) {
    return [];
  }
}
