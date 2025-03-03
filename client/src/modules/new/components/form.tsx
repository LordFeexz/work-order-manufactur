"use client";

import { memo, useActionState } from "react";
import type { INewWorkOrderState } from "../schema";
import { createWorkOrderAction } from "../action";
import LabelledInput from "@/components/common/labelled-input";
import DateInput from "@/components/common/date-input";
import SelectOperatorForm from "./select-operator-form";
import SubmitBtn from "@/components/common/submit-btn";

const initialState: INewWorkOrderState = {
  errors: {},
  name: "",
  amount: 0,
  deadline: new Date(),
  operatorId: "",
};

function NewWorkOrderForm() {
  const [
    { errors, error, name, amount, deadline, operatorId },
    formAction,
    pending,
  ] = useActionState(createWorkOrderAction, initialState);

  return (
    <form id="new-work-order-form" className="space-y-4" action={formAction}>
      <LabelledInput
        id="name"
        name="name"
        label="name"
        type="text"
        defaultValue={name}
        placeholder="Work Orders"
        required
        wrapperClassName="space-y-2"
        errors={errors?.name}
        min={2}
      />
      <LabelledInput
        id="amount"
        name="amount"
        label="amount"
        type="number"
        inputMode="numeric"
        min={1}
        max={999}
        defaultValue={amount}
        placeholder="amount"
        required
        wrapperClassName="space-y-2"
        errors={errors?.amount}
      />
      <DateInput
        id="deadline"
        name="deadline"
        label="deadline"
        value={deadline}
        required
        wrapperClassName="space-y-2"
        errors={errors?.deadline}
      />
      <SelectOperatorForm
        errors={errors?.operatorId}
        defaultValue={operatorId}
      />
      <SubmitBtn className="w-full" disabled={pending}>
        Submit
      </SubmitBtn>
      {error && (
        <div className="flex justify-center items-center">
          <p className="text-red-500 text-sm antialiased animate-pulse duration-1000">
            {error}
          </p>
        </div>
      )}
    </form>
  );
}

export default memo(NewWorkOrderForm);
