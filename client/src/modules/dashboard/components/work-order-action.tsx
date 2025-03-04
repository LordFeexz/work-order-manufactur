"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { USER_ROLE } from "@/enums/model";
import { WORK_ORDER_STATUS } from "@/interfaces/model";
import { Eye, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { memo, useMemo } from "react";
import UpdateStatusBtn from "./update-status-btn";
import { useSession } from "next-auth/react";
import type { CustomSession } from "@/interfaces/global";

export interface WorkOrderActionProps {
  no: string;
  status: WORK_ORDER_STATUS;
}

function WorkOrderAction({ no, status }: WorkOrderActionProps) {
  const { data: session, status: sessionStatus } = useSession();
  const { role } = (session as CustomSession)?.user ?? {};

  const [statusToUpdate, text, className] = useMemo(() => {
    if (sessionStatus !== "authenticated") return [null, "", ""];

    let statusToUpdate: WORK_ORDER_STATUS | null = null;
    let text = "";
    let className = " text-white px-4 py-2 rounded";

    if (role === USER_ROLE.OPERATOR) {
      if (status === WORK_ORDER_STATUS.PENDING) {
        statusToUpdate = WORK_ORDER_STATUS.IN_PROGRESS;
        className += " bg-blue-500";
        text = "Start Work";
      }

      if (status === WORK_ORDER_STATUS.IN_PROGRESS) {
        statusToUpdate = WORK_ORDER_STATUS.COMPLETED;
        className += " bg-green-500";
        text = "Finish Work";
      }
    }

    if (role === USER_ROLE.PRODUCT_MANAGER)
      if (status === WORK_ORDER_STATUS.PENDING) {
        statusToUpdate = WORK_ORDER_STATUS.CANCELLED;
        className += " bg-red-500";
        text = "Cancel Work";
      }

    return [statusToUpdate, text, className];
  }, [role, status, session, sessionStatus]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link
            prefetch
            href={`/work-order/${no}`}
            className="w-full flex justify-between items-center p-1"
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </DropdownMenuItem>
        {statusToUpdate && sessionStatus === "authenticated" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="flex justify-center">
              Update Status
            </DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <UpdateStatusBtn
                no={no}
                className={className}
                statusToUpdate={statusToUpdate}
                text={text}
              />
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default memo(WorkOrderAction);
