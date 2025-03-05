import Login from "@/modules/login";
import type { Metadata } from "next";

export default async function Page() {
  return <Login />;
}

export const dynamic = "force-static";

export const metadata: Metadata = { title: "Sign in to Your Account" };
