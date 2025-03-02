import { DataTypes } from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';
import type { BaseModel } from 'src/interfaces/model.interface';

export enum USER_ROLE {
  PRODUCT_MANAGER = 'product manager',
  OPERATOR = 'operator',
}

export const USER_ROLES = Object.values(USER_ROLE);

export interface IUserAttributes extends BaseModel<string> {
  role: USER_ROLE;
  username: string;
  password: string;
}

@Table<Model<IUserAttributes, IUserAttributes>>({
  modelName: 'users',
  tableName: 'users',
  underscored: true,
})
export class User
  extends Model<IUserAttributes, IUserAttributes>
  implements IUserAttributes
{
  @Column({
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  })
  public id: string;

  @Column({
    type: DataTypes.ENUM(USER_ROLE.PRODUCT_MANAGER, USER_ROLE.OPERATOR),
    allowNull: false,
    validate: {
      isIn: {
        args: [[USER_ROLE.PRODUCT_MANAGER, USER_ROLE.OPERATOR]],
        msg: 'role must be product manager or operator',
      },
      notNull: {
        msg: 'role is required',
      },
      notEmpty: {
        msg: 'role is required',
      },
    },
  })
  public role: USER_ROLE;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'username is required',
      },
      notEmpty: {
        msg: 'username is required',
      },
    },
    unique: true,
  })
  public username: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'password is required',
      },
      notEmpty: {
        msg: 'password is required',
      },
    },
  })
  public password: string;

  @Column({
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  })
  public deleted_at: Date | null;

  @Column({
    type: DataTypes.DATE,
    allowNull: false,
  })
  public created_at: Date;

  @Column({
    type: DataTypes.DATE,
    allowNull: false,
  })
  public updated_at: Date;
}
