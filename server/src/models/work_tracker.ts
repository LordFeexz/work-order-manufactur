import type { BaseModel } from 'src/interfaces/model.interface';
import { WORK_ORDER_STATUS } from './work_orders';
import { Column, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

export interface IWorkTrackerAttributes extends BaseModel<number> {
  work_order_number: string;
  updated_by: string;
  current_status: WORK_ORDER_STATUS;
  updated_status: WORK_ORDER_STATUS;
}

@Table<Model<IWorkTrackerAttributes, IWorkTrackerAttributes>>({
  tableName: 'work_trackers',
  modelName: 'work_trackers',
  underscored: true,
})
export class WorkTracker
  extends Model<IWorkTrackerAttributes, IWorkTrackerAttributes>
  implements IWorkTrackerAttributes
{
  @Column({
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  })
  public id: number;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: { tableName: 'work_orders' },
      key: 'no',
    },
    validate: {
      notNull: {
        msg: 'work order number is required',
      },
      notEmpty: {
        msg: 'work order number is required',
      },
    },
  })
  public work_order_number: string;

  @Column({
    allowNull: false,
    references: {
      model: { tableName: 'users' },
      key: 'id',
    },
    validate: {
      notNull: {
        msg: 'updated_by is required',
      },
      notEmpty: {
        msg: 'updated_by is required',
      },
    },
    type: DataTypes.UUID,
  })
  public updated_by: string;

  @Column({
    allowNull: false,
    validate: {
      isIn: {
        args: [
          [
            WORK_ORDER_STATUS.PENDING,
            WORK_ORDER_STATUS.IN_PROGRESS,
            WORK_ORDER_STATUS.COMPLETED,
            WORK_ORDER_STATUS.CANCELLED,
          ],
        ],
        msg: 'current_status must be Pending, In Progress, Completed, or Canceled',
      },
      notNull: {
        msg: 'current_status is required',
      },
      notEmpty: {
        msg: 'current_status is required',
      },
    },
    type: DataTypes.ENUM(
      WORK_ORDER_STATUS.PENDING,
      WORK_ORDER_STATUS.IN_PROGRESS,
      WORK_ORDER_STATUS.COMPLETED,
      WORK_ORDER_STATUS.CANCELLED,
    ),
  })
  public current_status: WORK_ORDER_STATUS;

  @Column({
    allowNull: false,
    validate: {
      isIn: {
        args: [
          [
            WORK_ORDER_STATUS.PENDING,
            WORK_ORDER_STATUS.IN_PROGRESS,
            WORK_ORDER_STATUS.COMPLETED,
            WORK_ORDER_STATUS.CANCELLED,
          ],
        ],
        msg: 'updated_status must be Pending, In Progress, Completed, or Canceled',
      },
      notNull: {
        msg: 'updated_status is required',
      },
      notEmpty: {
        msg: 'updated_status is required',
      },
    },
    type: DataTypes.ENUM(
      WORK_ORDER_STATUS.PENDING,
      WORK_ORDER_STATUS.IN_PROGRESS,
      WORK_ORDER_STATUS.COMPLETED,
      WORK_ORDER_STATUS.CANCELLED,
    ),
  })
  public updated_status: WORK_ORDER_STATUS;

  @Column({
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  })
  public deleted_at: Date | null;

  @Column({
    type: DataTypes.DATE,
    allowNull: true,
  })
  public created_at: Date;

  @Column({
    type: DataTypes.DATE,
    allowNull: true,
  })
  public updated_at: Date;
}
