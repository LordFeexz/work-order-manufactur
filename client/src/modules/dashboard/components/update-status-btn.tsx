"use client";

import { Button } from "@/components/ui/button";
import useMount from "@/hooks/use-mount";
import type { WORK_ORDER_STATUS } from "@/interfaces/model";
import { cn } from "@/libs/utils";
import { Loader2 } from "lucide-react";
import { memo, useCallback, useTransition } from "react";
import { updateWoStatus } from "../action";
import { toast } from "sonner";

export interface UpdateStatusBtnProps {
  className: string;
  statusToUpdate: WORK_ORDER_STATUS;
  text: string;
  no: string;
}

function UpdateStatusBtn({
  className,
  statusToUpdate,
  text,
  no,
}: UpdateStatusBtnProps) {
  const [pending, startTransition] = useTransition();
  const onClickHandler = useCallback(() => {
    startTransition(async () => {
      const { code, message } = await updateWoStatus(no, statusToUpdate);
      toast[code === 200 ? "info" : "error"](message);
    });
  }, [statusToUpdate, no]);

  const mount = useMount();
  if (!mount) return null;

  return (
    <Button
      disabled={pending}
      onClick={onClickHandler}
      className={cn(
        "p-2 m-2 cursor-pointer hover:scale-98 transition-all duration-300 min-w-28",
        className
      )}
    >
      {pending ? <Loader2 className="animate-spin w-4 h-4" /> : text}
    </Button>
  );
}

export default memo(UpdateStatusBtn);
