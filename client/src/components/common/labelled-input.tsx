import { memo, type ComponentProps } from "react";
import { Label } from "../ui/label";
import { cn } from "@/libs/utils";
import { Input } from "../ui/input";

export interface LabelledInputProps extends ComponentProps<"input"> {
  wrapperClassName?: string;
  id: string;
  label: string;
  required?: boolean;
  labelClassName?: string;
  errors?: string[];
}

function LabelledInput({
  wrapperClassName,
  id,
  label,
  required,
  labelClassName,
  errors = [],
  ...rest
}: LabelledInputProps) {
  return (
    <div aria-describedby={`label-${id}`} className={wrapperClassName}>
      <Label
        id={`label-${id}`}
        htmlFor={id}
        className={cn(
          "block mb-2 text-sm font-medium text-neutral-900 dark:text-neutral-300",
          required && "after:content-['*'] after:ml-0.5 after:text-red-500",
          labelClassName
        )}
      >
        {label}
      </Label>
      <Input required={required} aria-required={required} id={id} {...rest} />
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

export default memo(LabelledInput);
