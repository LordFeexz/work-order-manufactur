"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { cn } from "@/libs/utils";
import { Loader2 } from "lucide-react";
import { memo, type ComponentProps, type ReactNode } from "react";

export interface SubmitBtnProps extends Omit<ComponentProps<"button">, "type"> {
  loadingComponent?: ReactNode;
}

function SubmitBtn({
  disabled,
  className,
  children,
  loadingComponent = <Loader2 className="w-4 h-4" />,
  ...rest
}: SubmitBtnProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      {...rest}
      type="submit"
      aria-disabled={disabled || pending}
      aria-label="Submit"
      disabled={disabled || pending}
      className={cn(
        "rounded-md",
        pending && "cursor-wait",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className,
        "flex justify-center items-center",
        "hover:scale-[98.5%] hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-sm",
        "bg-blue-600 hover:bg-blue-700 text-neutral-900 dark:text-neutral-300 font-sans font-semibold"
      )}
    >
      {pending ? loadingComponent : children}
    </Button>
  );
}

export default memo(SubmitBtn);
