import {
  DASHBOARD_WORK_ORDERS_CACHE,
  WORK_ORDER_DETAIL_CACHE,
} from "@/constants/cache";
import type { PageProps } from "@/interfaces/global";
import { getServerSideSession } from "@/libs/session";
import Login from "@/modules/login";
import type { Metadata } from "next";
import { revalidatePath, revalidateTag } from "next/cache";

export default async function Page({ searchParams }: PageProps) {
  const { deleteSession = false } = await searchParams;

  if (deleteSession) {
    const session = await getServerSideSession();
    if (!session || !session?.user) return <Login />;

    revalidateTag(`${WORK_ORDER_DETAIL_CACHE}-${session?.user?.id}`);
    revalidateTag(`${DASHBOARD_WORK_ORDERS_CACHE}-${session?.user.id}`);
    revalidatePath("/");
  }

  return <Login />;
}

export const metadata: Metadata = { title: "Sign in to Your Account" };
