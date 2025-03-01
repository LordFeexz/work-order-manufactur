import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { memo } from "react";
import { ClipboardList } from "lucide-react";
import Form from "./components/form";
import Init from "./components/init";

function LoginPage() {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <Init />
      <Card className="w-full max-w-md" as="section">
        <CardHeader className="space-y-1" as="header">
          <div className="flex items-center justify-center mb-4">
            <ClipboardList className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">
            Manufacturing Work Order System
          </CardTitle>
          <CardDescription as="p" className="text-center">
            Enter your credentials to access the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form />
        </CardContent>
      </Card>
    </main>
  );
}

export default memo(LoginPage);
