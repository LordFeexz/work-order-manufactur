import { Transform } from 'class-transformer';
import { IsIn, IsString } from 'class-validator';
import { USER_ROLE, USER_ROLES } from 'src/models/users';
import { WORK_ORDER_STATUSES } from 'src/models/work_orders';

export class GetWorkTrackerDto {
  @IsString()
  public work_order_number: string;

  @IsString()
  public updater_name: string;

  @IsString()
  @IsIn(USER_ROLES)
  public updater_role: USER_ROLE;

  @IsString()
  @IsIn(WORK_ORDER_STATUSES)
  public current_status: string;

  @IsString()
  @IsIn(WORK_ORDER_STATUSES)
  public updated_status: string;

  @IsString()
  @Transform(({ value }) => new Date(value).toISOString())
  public created_at: string;
}
