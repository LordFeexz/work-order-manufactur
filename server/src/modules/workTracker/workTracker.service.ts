import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  type IWorkTrackerAttributes,
  WorkTracker,
} from 'src/models/work_tracker';
import { CreateWorkTrackerDto } from './dto/create.dto';
import { type CreateOptions } from 'sequelize';

@Injectable()
export class WorkTrackerService {
  constructor(
    @InjectModel(WorkTracker) private readonly model: typeof WorkTracker,
  ) {}

  public async create(
    payload: CreateWorkTrackerDto,
    opts?: CreateOptions<IWorkTrackerAttributes>,
  ) {
    return this.model.create(payload, opts);
  }
}
