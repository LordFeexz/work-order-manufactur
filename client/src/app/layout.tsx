import RootLayout from "@/components/layouts/root";
import type { ChildrenProps } from "@/interfaces/components";

export default function Layout({ children }: ChildrenProps) {
  return <RootLayout>{children}</RootLayout>;
}
