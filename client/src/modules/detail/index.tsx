import BackBtn from "@/components/common/back-btn";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WORK_ORDER_STATUS, type IWorkOrderDetail } from "@/interfaces/model";
import { memo } from "react";
import WorkOrderStatusBadge from "../dashboard/components/work-order-status-badge";
import { Calendar, CheckCircle, Clock, Package, User } from "lucide-react";
import { format } from "date-fns";

export interface DetailWorkOrderProps {
  data: IWorkOrderDetail;
}

function DetailWorkOrder({ data }: DetailWorkOrderProps) {
  return (
    <section id={`wo-${data.no}-detail`} className="flex-1 mt-8 px-4 py-6">
      <div className="mb-6 flex items-start flex-col space-y-4">
        <BackBtn variant="outline" className="mr-4" />
        <h1 className="text-3xl font-bold">Work Order Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <hgroup className="antialiased" id="text-header">
                <CardTitle className="text-2xl">{data.name}</CardTitle>
                <CardDescription as="p">Work Order #{data.no}</CardDescription>
              </hgroup>
              <WorkOrderStatusBadge status={data.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <article className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Package className="h-5 w-5 mr-2 text-muted-foreground" />
                <hgroup className="antialiased">
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium">
                    {data.amount} unit{data.amount > 1 ? "s" : ""}
                  </p>
                </hgroup>
              </div>

              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                <hgroup className="antialiased">
                  <p className="text-sm text-muted-foreground">Deadline</p>
                  <p className="font-medium">
                    {format(new Date(data.deadline), "PPp")}
                  </p>
                </hgroup>
              </div>

              {data.in_progress_at && (
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                  <hgroup className="antialiased">
                    <p className="text-sm text-muted-foreground">
                      Start Progress At
                    </p>
                    <p className="font-medium">
                      {format(new Date(data.in_progress_at), "PPp")}
                    </p>
                  </hgroup>
                </div>
              )}

              {data.in_finish_at && (
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                  <hgroup className="antialiased">
                    <p className="text-sm text-muted-foreground">
                      Finish Progress At
                    </p>
                    <p className="font-medium">
                      {format(new Date(data.in_finish_at), "PPp")}
                    </p>
                  </hgroup>
                </div>
              )}

              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-muted-foreground" />
                <hgroup className="antialiased">
                  <p className="text-sm text-muted-foreground">Created By</p>
                  <p className="font-medium">{data.creator_name}</p>
                </hgroup>
              </div>

              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-muted-foreground" />
                <hgroup className="antialiased">
                  <p className="text-sm text-muted-foreground">Assigned To</p>
                  <p className="font-medium">{data.operator_name}</p>
                </hgroup>
              </div>
            </article>

            <article className="border-t pt-4">
              <h3 className="font-medium mb-2">Timelines</h3>
              <div className="space-y-3 group/timeline">
                {data.timelines.map((timeline, idx) => (
                  <div className="flex items-start" key={idx}>
                    <div className="mr-2 bg-secondary rounded-full p-1">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <hgroup className="space-y-4 cursor-pointer group-hover/timeline:[&:not(:hover)]:opacity-50 border-2 border-accent w-full rounded-md py-2 px-4 hover:scale-99 shadow hover:shadow-lg transition-all duration-300">
                      <div className="antialiased">
                        <p className="font-medium">{timeline.updated_status}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(timeline.created_at), "PPp")}
                        </p>
                      </div>
                      <div className="antialiased">
                        <div className="text-sm text-muted-foreground capitalize">
                          {timeline.current_status ===
                            WORK_ORDER_STATUS.PENDING &&
                          timeline.updated_status ===
                            WORK_ORDER_STATUS.PENDING ? (
                            <p>
                              <strong>{timeline.updater_name}</strong> create wo{" "}
                              <strong>{data.name}</strong>
                            </p>
                          ) : (
                            <>
                              <strong>{timeline.updater_name}</strong> update
                              status from{" "}
                              <WorkOrderStatusBadge
                                status={timeline.current_status}
                              />{" "}
                              to{" "}
                              <WorkOrderStatusBadge
                                status={timeline.updated_status}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </hgroup>
                  </div>
                ))}
              </div>
            </article>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Operator Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
              <hgroup className="antialiased">
                <p className="font-medium capitalize">{data.operator_name}</p>
                <p className="text-sm text-muted-foreground">
                  Operator ID: {data.operator_id}
                </p>
              </hgroup>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default memo(DetailWorkOrder);
