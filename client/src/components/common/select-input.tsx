import { memo, type ComponentProps } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { cn } from "@/libs/utils";

export interface SelectOptions {
  value: string;
  label: string;
}

export interface SelectInputProps extends ComponentProps<typeof Select> {
  options: SelectOptions[];
  wrapperClassName?: string;
  id: string;
  label: string;
  required?: boolean;
  labelClassName?: string;
  errors?: string[];
  selectContentClassName?: string;
  itemClassName?: string;
  placeHolder?: string;
}

function SelectInput({
  wrapperClassName,
  id,
  label,
  required,
  labelClassName,
  errors = [],
  options = [],
  selectContentClassName,
  placeHolder = "Select a value",
  itemClassName,
  ...rest
}: SelectInputProps) {
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
      <Select {...rest}>
        <SelectTrigger>
          <SelectValue placeholder={placeHolder} />
        </SelectTrigger>
        <SelectContent className={selectContentClassName}>
          {options.map(({ value, label }) => (
            <SelectItem
              className={cn("capitalize", itemClassName)}
              key={value}
              value={value}
            >
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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

export default memo(SelectInput);
