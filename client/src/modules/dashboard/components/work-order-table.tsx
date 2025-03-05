"use client";

import type { IWorkOrderListData } from "@/interfaces/model";
import { memo, useCallback } from "react";
import { DASHBOARD_COLUMN } from "../constant";
import DataTable from "@/components/ui/data-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface WorkOrderTableProps {
  datas: IWorkOrderListData[];
  totalPage: number;
  page: number;
}

function WorkOrderTable({ datas, totalPage, page }: WorkOrderTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const onNextHandler = useCallback(() => {
    const params = new URLSearchParams(
      Object.fromEntries(searchParams?.entries()! ?? {})
    );
    params.set("page", String(page + 1));

    router.push(`${pathname}?${params.toString()}`);
  }, [router, searchParams, pathname]);

  const onPreviousHandler = useCallback(() => {
    const params = new URLSearchParams(
      Object.fromEntries(searchParams?.entries()! ?? {})
    );

    if (page - 1 > 0) params.set("page", String(page - 1));

    router.push(`${pathname}?${params.toString()}`);
  }, []);

  return (
    <DataTable
      columns={DASHBOARD_COLUMN as any}
      data={datas}
      ssrSearchKey="q"
      canNext={page < totalPage}
      canPrevious={page > 1}
      nextHandler={onNextHandler}
      previousHandler={onPreviousHandler}
    />
  );
}

export default memo(WorkOrderTable);
