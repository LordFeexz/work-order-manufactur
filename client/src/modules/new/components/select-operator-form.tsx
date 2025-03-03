"use client";

import SelectInput, {
  type SelectInputProps,
} from "@/components/common/select-input";
import type { IUserData } from "@/interfaces/model";
import { memo, useEffect, useMemo, useState, useTransition } from "react";
import { getOperatorData } from "../action";
import { cn } from "@/libs/utils";

export type ISelectOperatorFormProps = Pick<
  SelectInputProps,
  "errors" | "defaultValue"
>;

function SelectOperatorForm({
  errors = [],
  defaultValue,
}: ISelectOperatorFormProps) {
  const [operators, setOperators] = useState<IUserData[]>([]);
  const [pending, startTransition] = useTransition();
  const options = useMemo(
    () => operators.map(({ id, username }) => ({ value: id, label: username })),
    [operators]
  );

  useEffect(() => {
    if (operators.length) return;
    startTransition(async () => {
      setOperators(await getOperatorData());
    });
  }, [operators]);

  return (
    <SelectInput
      id="operator"
      name="operatorId"
      label="operator"
      options={options}
      required
      errors={errors}
      defaultValue={defaultValue}
      placeHolder="Select an operator"
      labelClassName={cn(
        pending &&
          "after:content-[''] after:inline-block after:w-4 after:h-4 after:ml-2 after:border-2 after:border-gray-500 after:border-t-transparent after:rounded-full after:animate-spin"
      )}
    />
  );
}

export default memo(SelectOperatorForm);
