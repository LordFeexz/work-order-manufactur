import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { WORK_ORDER_STATUS, WORK_ORDER_STATUSES } from 'src/models/work_orders';
import { GetWorkTrackerDto } from 'src/modules/workTracker/dto/get.dto';

export class GetDetailWorkOrder {
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
  public operator_id: string;

  @IsString()
  public created_by: string;

  @Type(() => GetWorkTrackerDto)
  @IsArray()
  @ValidateNested({ each: true })
  public timelines: GetWorkTrackerDto[];

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
