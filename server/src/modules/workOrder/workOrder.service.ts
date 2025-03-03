import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { endOfDay, startOfDay } from 'date-fns';
import {
  type Attributes,
  type CreateOptions,
  type FindOptions,
  Op,
  QueryTypes,
  type UpdateOptions,
} from 'sequelize';
import {
  type IWorkOrderAttributes,
  WORK_ORDER_STATUS,
  WORK_ORDER_STATUSES,
  WorkOrder,
} from 'src/models/work_orders';
import { CreateWODto } from './dto/create.dto';
import { Sequelize, type Model } from 'sequelize-typescript';
import type { IBaseQuery } from 'src/pipes/query.pipe';
import type {
  IGetWorkOrderQueryResult,
  IGetWorkOrderSchema,
} from './workOrder.schema';
import { USER_ROLE } from 'src/models/users';
import { plainToInstance } from 'class-transformer';
import { GetWorkOrderData } from './dto/get.dto';
import { validate } from 'uuid';

@Injectable()
export class WorkOrderService {
  constructor(
    @InjectModel(WorkOrder)
    private readonly model: typeof WorkOrder,
    private readonly sequelize: Sequelize,
  ) {}

  public async getWorkOrderCounter() {
    const today = new Date();

    return this.model.count({
      where: {
        created_at: {
          [Op.gte]: startOfDay(today),
          [Op.lte]: endOfDay(today),
        },
      },
    });
  }

  public async create(
    payload: CreateWODto,
    opts?: CreateOptions<IWorkOrderAttributes>,
  ) {
    return this.model.create(payload, opts);
  }

  public async findByNo(
    no: string,
    opts?: Omit<FindOptions<IWorkOrderAttributes>, 'where'>,
  ) {
    return this.model.findOne({ ...opts, where: { no } });
  }

  public async updateStatus(
    no: string,
    status: WORK_ORDER_STATUS,
    opts?: Omit<UpdateOptions<IWorkOrderAttributes>, 'where'>,
  ) {
    let payload: {
      [key in keyof Attributes<Model<IWorkOrderAttributes>>]?: Attributes<
        Model<IWorkOrderAttributes>
      >[key];
    } = { status };

    if (status === WORK_ORDER_STATUS.IN_PROGRESS)
      payload = { ...payload, in_progress_at: new Date() };

    if (
      [WORK_ORDER_STATUS.CANCELLED, WORK_ORDER_STATUS.COMPLETED].includes(
        status,
      )
    )
      payload = { ...payload, in_finish_at: new Date() };

    return this.model.update(payload, { ...opts, where: { no } });
  }

  public async reAssignOperator(
    no: string,
    operator_id: string,
    opts?: Omit<UpdateOptions<IWorkOrderAttributes>, 'where'>,
  ) {
    return this.model.update(
      { operator_id },
      { ...opts, where: { no, status: WORK_ORDER_STATUS.PENDING } },
    );
  }

  public async findAll({
    page = 1,
    limit = 10,
    q = null,
    status = null,
    user_id = null,
    role,
    operator_id = null,
  }: IBaseQuery<IGetWorkOrderSchema> & { role: USER_ROLE; user_id?: string }) {
    const bind: any[] = [(page - 1) * limit, limit];
    if (q) bind.push(q);

    const [{ total = 0, datas = [] } = { total: 0, datas: [] }] =
      await this.sequelize.query<IGetWorkOrderQueryResult>(
        `
        WITH
          work_order_datas AS (
            SELECT
              wo.no,
              wo.name,
              wo.amount,
              wo.deadline,
              wo.status,
              i.username AS operator_name
            FROM work_orders wo
            LEFT JOIN users i ON wo.operator_id = i.id
            WHERE 
              wo.deleted_at IS NULL
              ${role === USER_ROLE.OPERATOR ? ` AND wo.operator_id = '${user_id}'` : ''} 
              ${q ? ` AND (wo.name ILIKE '%' || $3 || '%' OR i.username ILIKE '%' || $3 || '%' OR wo.no ILIKE '%' || $3 || '%')` : ''}
              ${status && WORK_ORDER_STATUSES.includes(status) ? ` AND wo.status = '${status}'` : ''}
              ${operator_id && role === USER_ROLE.PRODUCT_MANAGER && validate(operator_id) ? ` AND wo.operator_id = '${operator_id}' AND i.role = 'operator' ` : ''}
            ORDER BY 
              wo.created_at ASC,
              wo.deadline DESC,
              wo.amount DESC
          ),
          total_datas AS (
            SELECT COUNT(wod.no) AS total
            FROM work_order_datas wod
          ),
          paginated_datas AS (
            SELECT * FROM work_order_datas
            LIMIT $2 OFFSET $1
          )
        SELECT
          (SELECT COALESCE(total, 0) FROM total_datas) AS total,
          (SELECT COALESCE(json_agg(pd.*), '[]') FROM paginated_datas pd) AS datas
        `,
        {
          type: QueryTypes.SELECT,
          bind,
          benchmark: true,
        },
      );

    return {
      total: Number(total),
      datas: plainToInstance(GetWorkOrderData, datas),
    };
  }
}
