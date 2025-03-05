import { Badge } from "@/components/ui/badge";
import { WORK_ORDER_STATUS } from "@/interfaces/model";
import { cn } from "@/libs/utils";
import { memo } from "react";

export interface WorkOrderStatusBadgesProps {
  status: WORK_ORDER_STATUS;
}

function WorkOrderStatusBadges({ status }: WorkOrderStatusBadgesProps) {
  const getVariant = () => {
    switch (status) {
      case WORK_ORDER_STATUS.PENDING:
        return "secondary";
      case WORK_ORDER_STATUS.IN_PROGRESS:
        return "default";
      case WORK_ORDER_STATUS.COMPLETED:
        return "outline";
      case WORK_ORDER_STATUS.CANCELLED:
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Badge
      className={cn(
        "text-xs capitalize",
        status === WORK_ORDER_STATUS.COMPLETED && "text-green-500"
      )}
      variant={getVariant()}
    >
      {status}
    </Badge>
  );
}

export default memo(WorkOrderStatusBadges);
