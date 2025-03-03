import { DataTypes } from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';
import type { BaseModel } from 'src/interfaces/model.interface';

export enum WORK_ORDER_STATUS {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  CANCELLED = 'Canceled',
}

export interface IWorkOrderAttributes extends Omit<BaseModel<any>, 'id'> {
  no: string;
  name: string;
  status: WORK_ORDER_STATUS;
  amount: number;
  deadline: Date;
  operator_id: string;
  created_by: string;
  in_progress_at: Date | null;
  in_finish_at: Date | null;
}

@Table<Model<IWorkOrderAttributes, IWorkOrderAttributes>>({
  tableName: 'work_orders',
  modelName: 'work_orders',
  underscored: true,
})
export class WorkOrder
  extends Model<IWorkOrderAttributes, IWorkOrderAttributes>
  implements IWorkOrderAttributes
{
  @Column({
    allowNull: false,
    unique: true,
    primaryKey: true,
    type: DataTypes.STRING,
  })
  public no: string;

  @Column({
    allowNull: false,
    validate: {
      notNull: {
        msg: 'name is required',
      },
      notEmpty: {
        msg: 'name is required',
      },
    },
    type: DataTypes.STRING,
  })
  public name: string;

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
        msg: 'status must be Pending, In Progress, Completed, or Canceled',
      },
      notNull: {
        msg: 'status is required',
      },
      notEmpty: {
        msg: 'status is required',
      },
    },
    type: DataTypes.ENUM(
      WORK_ORDER_STATUS.PENDING,
      WORK_ORDER_STATUS.IN_PROGRESS,
      WORK_ORDER_STATUS.COMPLETED,
      WORK_ORDER_STATUS.CANCELLED,
    ),
  })
  public status: WORK_ORDER_STATUS;

  @Column({
    allowNull: false,
    validate: {
      notNull: {
        msg: 'amount is required',
      },
      notEmpty: {
        msg: 'amount is required',
      },
      min: {
        args: [1],
        msg: 'amount must be greater than 0',
      },
    },
    type: DataTypes.INTEGER,
  })
  public amount: number;

  @Column({
    allowNull: false,
    validate: {
      notNull: {
        msg: 'deadline is required',
      },
      notEmpty: {
        msg: 'deadline is required',
      },
    },
    type: DataTypes.DATE,
  })
  public deadline: Date;

  @Column({
    allowNull: false,
    references: {
      model: { tableName: 'users' },
      key: 'id',
    },
    validate: {
      notNull: {
        msg: 'operator_id is required',
      },
      notEmpty: {
        msg: 'operator_id is required',
      },
    },
    type: DataTypes.UUID,
  })
  public operator_id: string;

  @Column({
    allowNull: false,
    references: {
      model: { tableName: 'users' },
      key: 'id',
    },
    validate: {
      notNull: {
        msg: 'created_by is required',
      },
      notEmpty: {
        msg: 'created_by is required',
      },
    },
    type: DataTypes.UUID,
  })
  public created_by: string;

  @Column({
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  })
  public deleted_at: Date | null;

  @Column({
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  })
  public in_progress_at: Date | null;

  @Column({
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  })
  public in_finish_at: Date | null;

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
