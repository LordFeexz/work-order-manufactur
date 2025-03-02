"use client";

import { memo, useCallback } from "react";
import { Button } from "../ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";

function LogOutBtn() {
  const router = useRouter();
  const { status } = useSession();
  const onClickHandler = useCallback(async () => {
    await signOut();
    router.replace("/login");
  }, [router]);

  if (status === "unauthenticated") return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={status !== "authenticated"}
      onClick={onClickHandler}
    >
      {status === "loading" ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          <LogOut className="w-5 h-5" />
          Log out
        </>
      )}
    </Button>
  );
}

export default memo(LogOutBtn);
