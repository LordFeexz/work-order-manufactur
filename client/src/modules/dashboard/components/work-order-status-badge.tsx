import { Badge } from "@/components/ui/badge";
import { WORK_ORDER_STATUS } from "@/interfaces/model";
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
        return "success";
      case WORK_ORDER_STATUS.CANCELLED:
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Badge className="text-xs capitalize" variant={getVariant() as any}>
      {status}
    </Badge>
  );
}

export default memo(WorkOrderStatusBadges);
