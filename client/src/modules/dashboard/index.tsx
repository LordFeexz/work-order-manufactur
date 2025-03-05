import { memo, Suspense } from "react";
import type { IWorkOrderListData } from "@/interfaces/model";
import WorkOrderTable from "./components/work-order-table";
import ExportDataBtn from "./components/export-data-btn";
import { Loader2 } from "lucide-react";

export interface DashboardPageProps {
  datas: IWorkOrderListData[];
  totalPage: number;
  page: number;
}

function DashboardPage({ datas, totalPage, page }: DashboardPageProps) {
  return (
    <section id="dashboard" className="flex-1 mt-8 px-4 py-6">
      <div className="flex items-center justify-start mb-6">
        <h1 className="text-3xl font-bold">Work Orders</h1>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex justify-end mb-4">
          <ExportDataBtn />
        </div>

        <Suspense
          fallback={
            <div className="flex justify-center items-center">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          }
        >
          <WorkOrderTable datas={datas} totalPage={totalPage} page={page} />
        </Suspense>
      </div>
    </section>
  );
}

export default memo(DashboardPage);
