import New from "@/modules/new";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "new work order",
};

export default async function Page() {
  return <New />;
}
