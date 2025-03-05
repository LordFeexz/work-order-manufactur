import {
  type MiddlewareConsumer,
  Module,
  type NestModule,
} from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Authentication } from 'src/middlewares/authentication.middleware';
import { WorkOrder } from 'src/models/work_orders';
import { WorkOrderController } from './workOrder.controller';
import { WorkOrderService } from './workOrder.service';
import { WorkTrackerModule } from '../workTracker/workTracker.module';

@Module({
  imports: [SequelizeModule.forFeature([WorkOrder]), WorkTrackerModule],
  controllers: [WorkOrderController],
  providers: [WorkOrderService],
})
export class WorkOrderModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(Authentication).forRoutes(WorkOrderController);
  }
}
