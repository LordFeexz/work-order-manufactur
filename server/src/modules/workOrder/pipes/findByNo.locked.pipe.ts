import {
  type ArgumentMetadata,
  Injectable,
  type PipeTransform,
} from '@nestjs/common';
import { WorkOrderService } from '../workOrder.service';
import { Transaction } from 'sequelize';

@Injectable()
export class WoFindByNoLockedPipe implements PipeTransform {
  public async transform(value: string, _: ArgumentMetadata) {
    return await this.workOrderService.findByNo(value, {
      lock: Transaction.LOCK.UPDATE,
      raw: true,
    });
  }

  constructor(private readonly workOrderService: WorkOrderService) {}
}
