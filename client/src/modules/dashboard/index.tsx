import { memo } from "react";
import type { IWorkOrderListData } from "@/interfaces/model";
import WorkOrderTable from "./components/work-order-table";

export interface DashboardPageProps {
  datas: IWorkOrderListData[];
}

function DashboardPage({ datas }: DashboardPageProps) {
  return (
    <section id="dashboard" className="flex-1 mt-8 px-4 py-6">
      <div className="flex items-center justify-start mb-6">
        <h1 className="text-3xl font-bold">Work Orders</h1>
      </div>

      <div className="flex flex-col gap-6">
        <div className="min-h-10">TODO</div>

        <div className="flex justify-end mb-4">
          <button>TODO</button>
        </div>

        <WorkOrderTable datas={datas} />
      </div>
    </section>
  );
}

export default memo(DashboardPage);
