import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { WorkTracker } from 'src/models/work_tracker';
import { WorkTrackerService } from './workTracker.service';

@Module({
  imports: [SequelizeModule.forFeature([WorkTracker])],
  providers: [WorkTrackerService],
  exports: [WorkTrackerService],
})
export class WorkTrackerModule {}
