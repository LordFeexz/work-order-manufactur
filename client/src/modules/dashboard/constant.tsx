import type { IWorkOrderListData } from "@/interfaces/model";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import WorkOrderStatusBadge from "./components/work-order-status-badge";
import WorkOrderAction from "./components/work-order-action";

export const DASHBOARD_COLUMN: ColumnDef<IWorkOrderListData>[] = [
  {
    accessorKey: "no",
    header: "Work Order",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "deadline",
    header: "Deadline",
    cell: ({ row: { original } }) => format(new Date(original.deadline), "PPp"),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row: { original } }) => (
      <WorkOrderStatusBadge status={original.status} />
    ),
  },
  {
    accessorKey: "operator_name",
    header: "Assigned To",
  },
  {
    id: "actions",
    cell: ({ row: { original } }) => (
      <WorkOrderAction no={original.no} status={original.status} />
    ),
  },
];
