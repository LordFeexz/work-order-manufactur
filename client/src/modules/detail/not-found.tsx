import BackBtn from "@/components/common/back-btn";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { memo } from "react";

function DetailNotFound() {
  return (
    <section id="detail-not-found" className="flex-1 mt-12 px-4 py-6">
      <div className="flex justify-center items-center h-full">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Work Order Not Found</CardTitle>
            <CardDescription>
              The requested work order could not be found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BackBtn />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default memo(DetailNotFound);
