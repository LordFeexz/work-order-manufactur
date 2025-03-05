export interface IUserData {
  username: string;
  id: string;
}

export interface IWorkOrderListData {
  no: string;
  name: string;
  amount: number;
  deadline: Date | string;
  status: WORK_ORDER_STATUS;
  operator_name: string;
}

export enum WORK_ORDER_STATUS {
  PENDING = "Pending",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  CANCELLED = "Canceled",
}

export interface IWorkOrderDetail {
  no: string;
  name: string;
  amount: number;
  deadline: Date | string;
  status: WORK_ORDER_STATUS;
  operator_name: string;
  creator_name: string;
  operator_id: string;
  created_by: string;
  in_progress_at: Date | string | null;
  in_finish_at: Date | string | null;
  created_at: Date | string;
  timelines: Timeline[];
}

export interface Timeline {
  work_order_number: string;
  updater_name: string;
  updater_role: string;
  created_at: Date | string;
  current_status: WORK_ORDER_STATUS;
  updated_status: WORK_ORDER_STATUS;
}
