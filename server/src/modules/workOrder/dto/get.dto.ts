import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsString } from 'class-validator';
import { WORK_ORDER_STATUS, WORK_ORDER_STATUSES } from 'src/models/work_orders';

export class GetWorkOrderData {
  @IsString()
  public no: string;

  @IsString()
  public name: string;

  @IsInt()
  @Transform(({ value }) => Number(value))
  public amount: number;

  @IsString()
  @Transform(({ value }) => new Date(value).toISOString())
  public deadline: string;

  @IsString()
  @IsIn(WORK_ORDER_STATUSES)
  public status: WORK_ORDER_STATUS;

  @IsString()
  public operator_name: string;
}
