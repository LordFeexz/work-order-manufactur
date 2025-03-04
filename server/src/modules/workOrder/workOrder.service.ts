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
import { GetDetailWorkOrder } from './dto/get.detail.dto';
import { GetExportWorkOrder } from './dto/get.export.dto';

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

  public async findDetailByNo(no: string) {
    const [result] = await this.sequelize.query<GetDetailWorkOrder>(
      `SELECT
        wo.no,
        wo.name,
        wo.amount,
        wo.deadline,
        wo.status,
        op.username AS operator_name,
        pm.username AS creator_name,
        wo.operator_id,
        wo.created_by,
        wo.in_progress_at,
        wo.in_finish_at,
        (
          COALESCE(
            json_agg(
              json_build_object(
                'work_order_number', wt.work_order_number,
                'updater_name', up.username,
                'updater_role', up.role,
                'created_at', wt.created_at,
                'current_status', wt.current_status,
                'updated_status', wt.updated_status
              )
            ),
          '[]'
          )
        ) AS timelines
      FROM work_orders wo
      LEFT JOIN users op ON wo.operator_id = op.id
      LEFT JOIN users pm ON wo.created_by = pm.id
      LEFT JOIN work_trackers wt ON wo.no = wt.work_order_number
      LEFT JOIN users up ON wt.updated_by = up.id
      WHERE wo.no = $1
      GROUP BY
        wo.no,
        wo.name,
        wo.amount,
        wo.deadline,
        wo.status,
        op.username,
        pm.username,
        wo.in_progress_at,
        wo.in_finish_at
      `,
      {
        type: QueryTypes.SELECT,
        bind: [no],
        benchmark: true,
      },
    );

    if (!result) return null;

    return plainToInstance(GetDetailWorkOrder, result);
  }

  public async findExportedWorkOrder({
    q = null,
    status = null,
    operator_id = null,
  }: Omit<IBaseQuery<IGetWorkOrderSchema>, 'page' | 'limit'>) {
    const bind = [];
    if (q) bind.push(q);
    const results = await this.sequelize.query<GetExportWorkOrder>(
      `
      SELECT 
        wo.no,
        wo.name,
        wo.amount,
        wo.deadline,
        wo.status,
        op.username AS operator_name,
        pm.username AS creator_name,
        wo.operator_id,
        wo.created_by,
        wo.in_progress_at,
        wo.in_finish_at
      FROM work_orders wo
      LEFT JOIN users op ON wo.operator_id = op.id
      LEFT JOIN users pm ON wo.created_by = pm.id
      WHERE 
        1 = 1
        ${q ? ` AND (wo.name ILIKE '%' || $1 || '%' OR i.username ILIKE '%' || $1 || '%' OR wo.no ILIKE '%' || $1 || '%')` : ''}
        ${status && WORK_ORDER_STATUSES.includes(status) ? ` AND wo.status = '${status}'` : ''}
        ${operator_id && validate(operator_id) ? ` AND wo.operator_id = '${operator_id}' AND i.role = 'operator' ` : ''}
      GROUP BY
        wo.no,
        wo.name,
        wo.amount,
        wo.deadline,
        wo.status,
        op.username,
        pm.username,
        wo.in_progress_at,
        wo.in_finish_at
      ORDER BY
        wo.in_progress_at DESC,
        wo.in_finish_at DESC,
        wo.deadline DESC,
        wo.amount DESC

      `,
      {
        type: QueryTypes.SELECT,
        bind,
        benchmark: true,
      },
    );

    return plainToInstance(GetExportWorkOrder, results);
  }
}
