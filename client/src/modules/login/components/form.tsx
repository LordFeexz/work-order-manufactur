"use client";

import { memo, useActionState, useEffect, useTransition } from "react";
import { loginAction } from "../action";
import type { ILoginState } from "../schema";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import LabelledInput from "@/components/common/labelled-input";
import { CardFooter } from "@/components/ui/card";
import SubmitBtn from "@/components/common/submit-btn";

const initialState: ILoginState = {
  username: "",
  password: "",
  errors: {},
};

function LoginForm() {
  const [{ username, password, errors, token, error }, formAction, pending] =
    useActionState(loginAction, initialState);
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    startTransition(async () => {
      if (token) {
        const resp = await signIn("credentials", {
          access_token: token,
          redirect: false,
        });
        if (resp && resp?.ok) {
          router.push("/");
          return;
        }
      }
    });
  }, [token, router]);

  return (
    <form className="space-y-4" id="login-form" action={formAction}>
      <LabelledInput
        id="username"
        name="username"
        label="username"
        type="text"
        defaultValue={username}
        placeholder="JohnDoe"
        required
        wrapperClassName="space-y-2"
        errors={errors?.username}
      />
      <LabelledInput
        id="password"
        name="password"
        label="password"
        type="password"
        defaultValue={password}
        placeholder="........"
        required
        wrapperClassName="space-y-2"
        errors={errors?.password}
      />
      <CardFooter className="p-0">
        <SubmitBtn className="w-full" disabled={pending || loading}>
          Sign in
        </SubmitBtn>
      </CardFooter>
      {error && (
        <div className="flex justify-center items-center">
          <p className="text-red-500 text-sm antialiased animate-pulse duration-1000">
            {error}
          </p>
        </div>
      )}
    </form>
  );
}

export default memo(LoginForm);
