"use client";

import { Button } from "@/components/ui/button";
import { USER_ROLE } from "@/enums/model";
import type { CustomSession } from "@/interfaces/global";
import { request } from "@/libs/request";
import { cn } from "@/libs/utils";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  memo,
  useCallback,
  useTransition,
  type MouseEventHandler,
} from "react";
import { toast } from "sonner";

function ExportDataBtn() {
  const { data: session, status } = useSession();
  const [pending, startTransition] = useTransition();
  const onClickHandler: MouseEventHandler = useCallback(() => {
    startTransition(async () => {
      if (
        status !== "authenticated" ||
        !(session as CustomSession)?.user?.access_token
      )
        return;

      try {
        const response = await request(`/work-orders/export`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${
              (session as CustomSession)?.user?.access_token
            }`,
          },
        });

        if (
          !response.ok ||
          !response.headers
            .get("Content-Type")
            ?.includes(
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            )
        ) {
          toast.error("failed to download export data");
          return;
        }

        const file = await response.blob();
        const url = window.URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "export_work_order.xlsx");
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        toast.info("file downloaded");
      } catch (err) {
        console.log(err);
        toast.error("failed to download export data");
        return;
      }
    });
  }, [status, session]);

  if (
    status !== "authenticated" ||
    (session as CustomSession)?.user?.role !== USER_ROLE.PRODUCT_MANAGER
  )
    return null;

  return (
    <Button
      id="export-data-btn"
      onClick={onClickHandler}
      className={cn(
        "hover:scale-98 transition-all duration-300 min-w-28",
        pending ? "cursor-progress" : "cursor-pointer"
      )}
    >
      {pending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        "Export All Data"
      )}
    </Button>
  );
}

export default memo(ExportDataBtn);
