"use client";

import useAuthenticatedOnly from "@/hooks/use-unauthenticated-only";
import { signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useTransition } from "react";

export default function Init() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [, startTransition] = useTransition();
  useEffect(() => {
    startTransition(async () => {
      const deleteSession = Boolean(searchParams?.get("deleteSession"));
      if (deleteSession) {
        await signOut({ redirect: false });
        router.replace("/login");
      }
    });
  }, []);

  useAuthenticatedOnly();

  return null;
}
