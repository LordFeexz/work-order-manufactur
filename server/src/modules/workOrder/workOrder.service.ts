import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { endOfDay, startOfDay } from 'date-fns';
import { type CreateOptions, Op } from 'sequelize';
import { type IWorkOrderAttributes, WorkOrder } from 'src/models/work_orders';
import { CreateWODto } from './dto/create.dto';

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
}
