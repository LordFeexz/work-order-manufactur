export interface IRespBodyProps<T = any> {
  code: number;
  message: string;
  data?: T;
  errors?: Record<string, string> | null;
}

export interface PaginationRespProps {
  page: number;
  limit: number;
  totalData: number;
  totalPage: number;
}

export type IRespBody<T = any> = IRespBodyProps<T> & {
  status: string;
} & Partial<PaginationRespProps>;
