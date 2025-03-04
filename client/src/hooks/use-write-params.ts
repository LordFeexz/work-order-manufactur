import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition, type ChangeEvent } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function useWriteParams(name: string, delay = 300) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const handler = useDebouncedCallback((e: ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      const currentParams = new URLSearchParams(searchParams?.toString());
      if (e.target.value) currentParams.set(name, e.target.value);
      else currentParams.delete(name);

      router.push(`${pathname}?${currentParams.toString()}`);
    });
  }, delay);

  return [pending, searchParams?.get(name) ?? "", handler] as const;
}
