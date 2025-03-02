import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { memo } from "react";
import Form from "./components/form";

function NewWorkOrder() {
  return (
    <div className="flex-1 px-4 py-6 mt-12">
      <div className="flex justify-center items-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Create New Work Order</CardTitle>
            <CardDescription>
              Fill in the details to create a new manufacturing work order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default memo(NewWorkOrder);
