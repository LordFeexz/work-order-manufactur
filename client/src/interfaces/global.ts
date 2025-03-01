import type { Session } from "next-auth";

export type Locales = "en" | "id";

export type PageProps<
  params = Record<string, string>,
  searchParams = Record<string, string>
> = {
  params: Promise<params & { locale: Locales }>;
  searchParams: Promise<Partial<searchParams>>;
};

export interface CustomSession extends Session {
  user?: {
    id?: string;
    name?: string | null;
    role?: string | null;
  };
}
