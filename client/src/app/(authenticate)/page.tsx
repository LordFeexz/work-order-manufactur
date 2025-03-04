import type { PageProps } from "@/interfaces/global";
import Dashboard from "@/modules/dashboard";
import { getWorkOrderDatas } from "@/modules/dashboard/action";
import { getWorkOrderDatasSchemaQuery } from "@/modules/dashboard/schema";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export default async function Page({ searchParams }: PageProps) {
  const { success, data } = await getWorkOrderDatasSchemaQuery.safeParseAsync(
    await searchParams
  );

  if (!success)
    redirect(`/?${new URLSearchParams({ page: "1", limit: "10" }).toString()}`);

  const { data: workOrderDatas = [] } = await getWorkOrderDatas(data);

  return <Dashboard datas={workOrderDatas} />;
}

export const metadata: Metadata = {
  title: "Dashboard",
};
