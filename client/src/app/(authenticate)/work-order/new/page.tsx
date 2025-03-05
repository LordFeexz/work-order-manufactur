import { USER_ROLE } from "@/enums/model";
import { getServerSideSession } from "@/libs/session";
import New from "@/modules/new";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "new work order",
};

export default async function Page() {
  const session = await getServerSideSession();
  if (!session || !session?.user) redirect("/login?deleteSession=true");

  if (session.user?.role !== USER_ROLE.PRODUCT_MANAGER) redirect("/");

  return <New />;
}
