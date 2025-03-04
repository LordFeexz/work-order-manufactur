import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { WORK_ORDER_STATUS, WORK_ORDER_STATUSES } from 'src/models/work_orders';

export class GetExportWorkOrder {
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

  @IsString()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : null))
  @IsOptional()
  public in_progress_at: string | null;

  @IsString()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : null))
  @IsOptional()
  public in_finish_at: string | null;

  @IsString()
  public creator_name: string;
}
