"use client";

import { memo, useRef, type ComponentProps } from "react";
import { Label } from "../ui/label";
import { cn } from "@/libs/utils";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";

export interface DateInputProps extends Omit<ComponentProps<"input">, "type"> {
  wrapperClassName?: string;
  id: string;
  label: string;
  required?: boolean;
  labelClassName?: string;
  errors?: string[];
  buttonClassName?: string;
}

function DateInput({
  wrapperClassName,
  id,
  label,
  required,
  labelClassName,
  errors = [],
  buttonClassName,
  ...rest
}: DateInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSelect = (date: Date | undefined) => {
    if (date && inputRef.current) {
      inputRef.current.value = format(date, "yyyy-MM-dd");
      inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
    }
  };

  return (
    <div aria-describedby={`label-${id}`} className={wrapperClassName}>
      <Label
        id={`label-${id}`}
        htmlFor={id}
        className={cn(
          "block mb-2 text-sm font-medium text-neutral-900 dark:text-neutral-300 capitalize",
          required && "after:content-['*'] after:ml-0.5 after:text-red-500",
          labelClassName
        )}
      >
        {label}
      </Label>
      <Input
        ref={inputRef}
        type="hidden"
        required={required}
        aria-required={required}
        id={id}
        className="hidden"
        {...rest}
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button className={buttonClassName} variant="outline">
            Select Date
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar mode="single" onSelect={handleSelect} initialFocus />
        </PopoverContent>
      </Popover>
      {!!errors.length && (
        <div className="flex flex-col justify-center items-center">
          {errors.map((error) => (
            <p
              key={error}
              className="text-red-500 text-sm antialiased animate-pulse duration-1000"
            >
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(DateInput);
