import HeaderNav from "@/components/layouts/header-nav";
import type { ChildrenProps } from "@/interfaces/components";
import { getServerSideSession } from "@/libs/session";
import { redirect } from "next/navigation";

export default async function Layout({ children }: ChildrenProps) {
  const session = await getServerSideSession();
  if (!session || !session.user) redirect("/login");

  return (
    <div
      className="flex flex-col min-h-screen"
      id="container"
      data-testid="container"
    >
      <HeaderNav
        role={session?.user?.role}
        name={session?.user?.name ?? "user"}
      />
      <main data-testid="main" className="min-h-screen" id="main-content">
        {children}
      </main>
    </div>
  );
}
