import { WORK_ORDER_STATUS } from 'src/models/work_orders';

export interface CreateWorkTrackerDtoProps {
  work_order_number: string;
  updated_by: string;
  current_status: WORK_ORDER_STATUS;
  updated_status: WORK_ORDER_STATUS;
}

export class CreateWorkTrackerDto {
  work_order_number: string;
  updated_by: string;
  current_status: WORK_ORDER_STATUS;
  updated_status: WORK_ORDER_STATUS;

  constructor({
    work_order_number,
    updated_by,
    current_status,
    updated_status,
  }: CreateWorkTrackerDtoProps) {
    this.work_order_number = work_order_number;
    this.updated_by = updated_by;
    this.current_status = current_status;
    this.updated_status = updated_status;
  }
}

export class InitialCreateWorkTrackerDto {
  work_order_number: string;
  updated_by: string;
  current_status: WORK_ORDER_STATUS = WORK_ORDER_STATUS.PENDING;
  updated_status: WORK_ORDER_STATUS = WORK_ORDER_STATUS.PENDING;

  constructor({
    work_order_number,
    updated_by,
  }: Omit<CreateWorkTrackerDtoProps, 'current_status' | 'updated_status'>) {
    this.work_order_number = work_order_number;
    this.updated_by = updated_by;
  }
}
