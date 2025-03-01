import type { ReactNode } from "react";
import type { PageProps } from "./global";

export interface ChildrenProps {
  readonly children: ReactNode;
}

export type PagePropsWithChildren<T = {}, K = {}> = ChildrenProps &
  PageProps<T, K>;
