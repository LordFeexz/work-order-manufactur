"use server";

import { request } from "@/libs/request";
import type { INewWorkOrderState } from "./schema";
import { getServerSideSession } from "@/libs/session";
import { redirect } from "next/navigation";
import type { IRespBody } from "@/interfaces/response";
import type { IUserData } from "@/interfaces/model";

export async function createWorkOrderAction(
  prevState: INewWorkOrderState,
  formData: FormData
) {
  return prevState;
}

export async function getOperatorData() {
  const session = await getServerSideSession();
  if (!session || !session?.user?.access_token) redirect("/login");

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
}
