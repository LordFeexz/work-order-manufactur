import type { ComponentProps, JSX } from "react";
import { cn } from "@/libs/utils";

function Card({
  className,
  as: Tag = "div",
  ...props
}: ComponentProps<"div"> & {
  as?: "div" | "section" | "article" | "main";
}) {
  return (
    <Tag
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({
  className,
  as: Tag = "div",
  ...props
}: ComponentProps<"div"> & { as?: "div" | "header" }) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 px-6", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

function CardDescription({
  className,
  as: Tag = "div",
  ...props
}: ComponentProps<"div"> & { as?: "div" | "p" }) {
  return (
    <Tag
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
