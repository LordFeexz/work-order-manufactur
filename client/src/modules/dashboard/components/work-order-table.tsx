"use client";

import type { IWorkOrderListData } from "@/interfaces/model";
import { memo } from "react";
import { DASHBOARD_COLUMN } from "../constant";
import { DataTable } from "@/components/ui/data-table";

export interface WorkOrderTableProps {
  datas: IWorkOrderListData[];
}

function WorkOrderTable({ datas }: WorkOrderTableProps) {
  return <DataTable columns={DASHBOARD_COLUMN} data={datas} searchKey="name" />;
}

export default memo(WorkOrderTable);
