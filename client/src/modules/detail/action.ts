"use server";

import { WORK_ORDER_DETAIL_CACHE } from "@/constants/cache";
import type { IWorkOrderDetail } from "@/interfaces/model";
import type { IRespBody } from "@/interfaces/response";
import { request } from "@/libs/request";
import { getServerSideSession } from "@/libs/session";
import { redirect } from "next/navigation";

export async function getWoDetail(no: string) {
  const session = await getServerSideSession();
  if (!session || !session?.user) redirect("/login?deleteSession=true");

  try {
    const response = await request(`/work-orders/${no}`, {
      method: "GET",
      cache: "force-cache",
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
      next: {
        revalidate: 259200000, //3 hari
        tags: [
          `${WORK_ORDER_DETAIL_CACHE}-${session?.user?.id}`,
          `${WORK_ORDER_DETAIL_CACHE}-${no}`,
        ],
      },
    });

    if (!response.ok || response.status !== 200) return null;

    const { data } = (await response.json()) as IRespBody<IWorkOrderDetail>;
    return data as IWorkOrderDetail;
  } catch (err) {
    return null;
  }
}
