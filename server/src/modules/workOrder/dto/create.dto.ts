import { endOfDay, format } from 'date-fns';
import { WORK_ORDER_STATUS } from 'src/models/work_orders';

export interface CreateWODtoProps {
  counter: number;
  name: string;
  amount: number;
  deadline: Date;
  operator_id: string;
  created_by: string;
}

export class CreateWODto {
  name: string;
  amount: number;
  deadline: Date;
  operator_id: string;
  created_by: string;
  no: string;
  status = WORK_ORDER_STATUS.PENDING;

  constructor({
    counter,
    created_by,
    operator_id,
    deadline,
    amount,
    name,
  }: CreateWODtoProps) {
    this.no = `WO-${format(new Date(), 'yyyyMMdd')}-${String(counter + 1).padStart(3, '0')}`;
    this.name = name;
    this.created_by = created_by;
    this.amount = amount;
    this.operator_id = operator_id;
    this.deadline = endOfDay(deadline);
  }
}
