import {
  type ArgumentMetadata,
  Injectable,
  type PipeTransform,
} from '@nestjs/common';
import { WorkOrderService } from '../workOrder.service';
import type { GetDetailWorkOrder } from '../dto/get.detail.dto';

@Injectable()
export class WoFindDetailByNoPipe
  implements PipeTransform<string, Promise<GetDetailWorkOrder | null>>
{
  public async transform(value: string, _: ArgumentMetadata) {
    return await this.workOrderService.findDetailByNo(value);
  }

  constructor(private readonly workOrderService: WorkOrderService) {}
}
