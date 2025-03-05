"use server";

import { getServerSideSession } from "@/libs/session";
import type { IGetWorkOrderDatasSchemaQuery } from "./schema";
import { redirect } from "next/navigation";
import { request } from "@/libs/request";
import {
  DASHBOARD_WORK_ORDERS_CACHE,
  WORK_ORDER_DETAIL_CACHE,
} from "@/constants/cache";
import type { IRespBody } from "@/interfaces/response";
import type { IWorkOrderListData, WORK_ORDER_STATUS } from "@/interfaces/model";
import { revalidatePath, revalidateTag } from "next/cache";

export async function getWorkOrderDatas({
  page = 1,
  limit = 5,
  q = null,
  status = null,
  operator_id = null,
}: IGetWorkOrderDatasSchemaQuery) {
  const session = await getServerSideSession();
  if (!session || !session?.user) redirect("/login?deleteSession=true");

  try {
    const response = await request(`/work-orders`, {
      method: "GET",
      query: {
        page,
        limit,
        q,
        status,
        operator_id,
        user_id: session?.user.id,
      },
      next: {
        revalidate: q
          ? 60000 //1 menit
          : 259200000, //3 hari
        tags: [`${DASHBOARD_WORK_ORDERS_CACHE}-${session?.user.id}`],
      },
      cache: "force-cache",
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
    });

    if (!response.ok || response.status !== 200)
      return {
        data: [],
        code: response.status,
        errors: null,
        message: "unexpected error",
        page,
        limit,
        totalData: 0,
        totalPage: 0,
      };

    return (await response.json()) as IRespBody<IWorkOrderListData[]>;
  } catch (err) {
    return {
      data: [],
      code: 500,
      errors: null,
      message: "unexpected error",
      page,
      limit,
      totalData: 0,
      totalPage: 0,
    };
  }
}

export async function updateWoStatus(no: string, status: WORK_ORDER_STATUS) {
  const session = await getServerSideSession();
  if (!session || !session?.user) redirect("/login?deleteSession=true");

  try {
    const response = await request(`/work-orders/${no}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok)
      return {
        code: response.status,
        message: "unexpected error",
      };

    const { code, message } = (await response.json()) as IRespBody;

    revalidateTag(`${DASHBOARD_WORK_ORDERS_CACHE}-${session?.user.id}`);
    revalidateTag(`${WORK_ORDER_DETAIL_CACHE}-${session?.user.id}`);
    revalidateTag(`${WORK_ORDER_DETAIL_CACHE}-${no}`);
    revalidatePath("/");

    return { code, message };
  } catch (err) {
    return {
      code: 500,
      message: "unexpected error",
    };
  }
}
