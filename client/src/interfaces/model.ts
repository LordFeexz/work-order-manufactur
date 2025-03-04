export interface IUserData {
  username: string;
  id: string;
}

export interface IWorkOrderListData {
  no: string;
  name: string;
  amount: number;
  deadline: Date;
  status: WORK_ORDER_STATUS;
  operator_name: string;
}

export enum WORK_ORDER_STATUS {
  PENDING = "Pending",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  CANCELLED = "Canceled",
}
