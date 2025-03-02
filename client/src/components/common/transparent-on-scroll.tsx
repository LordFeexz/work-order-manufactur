"use client";

import { cn } from "@/libs/utils";
import { memo, useEffect, useState, type HTMLAttributes } from "react";

export interface TransarentOnScrollProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "section" | "header" | "article" | "nav" | "main";
  className?: string;
}

function TransarentOnScroll({
  as: Tag = "div",
  className,
  ...rest
}: TransarentOnScrollProps) {
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Tag
      {...rest}
      className={cn(
        className,
        "transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-md shadow-xs"
          : "bg-transparent"
      )}
    ></Tag>
  );
}

export default memo(TransarentOnScroll);
