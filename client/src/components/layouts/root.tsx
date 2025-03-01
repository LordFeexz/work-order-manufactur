import type { ChildrenProps } from "@/interfaces/components";
import Loader from "nextjs-toploader";
import { Sora } from "next/font/google";
import { cn } from "@/libs/utils";
import AppThemeProvider from "../providers/themes";
import "@/styles/globals.css";
import { Toaster } from "../ui/sonner";
import { SessionProvider } from "../providers/session";

export const fontSora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export default function RootLayout({ children }: ChildrenProps) {
  return (
    <html lang="en" suppressContentEditableWarning suppressHydrationWarning>
      <body
        className={cn(
          fontSora.variable,
          fontSora.className,
          "antialiased scroll-smooth !min-h-svh",
          "text-neutral-900 dark:text-neutral-300"
        )}
      >
        <Loader
          color="#05b6d3"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl
          showSpinner
          easing="ease"
          speed={200}
          shadow="0 0 10px #05b6d3,0 0 5px #45c6c0"
        />
        <AppThemeProvider>
          <SessionProvider>{children}</SessionProvider>
          <Toaster />
        </AppThemeProvider>
      </body>
    </html>
  );
}
