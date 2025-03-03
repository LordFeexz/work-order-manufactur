import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { endOfDay, startOfDay } from 'date-fns';
import {
  type Attributes,
  type CreateOptions,
  type FindOptions,
  Op,
  type UpdateOptions,
} from 'sequelize';
import {
  type IWorkOrderAttributes,
  WORK_ORDER_STATUS,
  WorkOrder,
} from 'src/models/work_orders';
import { CreateWODto } from './dto/create.dto';
import { type Model } from 'sequelize-typescript';

@Injectable()
export class WorkOrderService {
  constructor(
    @InjectModel(WorkOrder) private readonly model: typeof WorkOrder,
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
}
