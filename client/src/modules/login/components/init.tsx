"use client";

import useAuthenticatedOnly from "@/hooks/use-unauthenticated-only";

export default function Init() {
  useAuthenticatedOnly();

  return null;
}
