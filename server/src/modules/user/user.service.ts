import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, QueryTypes } from 'sequelize';
import {
  type IUserAttributes,
  User,
  USER_ROLE,
  USER_ROLES,
} from 'src/models/users';
import type { IBaseQuery } from 'src/pipes/query.pipe';
import type { GetUserQueryResult, IGetOperatorSchema } from './user.schema';
import { Sequelize } from 'sequelize-typescript';
import { GetUserDto } from './dto/get.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private model: typeof User,
    private readonly sequelize: Sequelize,
  ) {}

  public async findByUsername(
    username: string,
    opts?: Omit<FindOptions<IUserAttributes>, 'where'>,
  ) {
    return this.model.findOne({ ...opts, where: { username } });
  }

  public async findById(id: string, opts?: FindOptions<IUserAttributes>) {
    return this.model.findByPk(id, opts);
  }

  public async findUser({
    page = 1,
    limit = 10,
    q = null,
    role = USER_ROLE.OPERATOR,
  }: IBaseQuery<IGetOperatorSchema> & Partial<{ role: USER_ROLE | '*' }>) {
    const bind: any[] = [(page - 1) * limit, limit];
    if (q) bind.push(q);

    const [{ total = 0, datas = [], ...t } = { total: 0, datas: [] }] =
      await this.sequelize.query<GetUserQueryResult>(
        `WITH
          user_datas AS (
            SELECT
              id,
              username
            FROM users
            WHERE 
            deleted_at IS NULL
            ${role !== '*' && USER_ROLES.includes(role) ? ` AND role = '${role}'` : ''}
            ${q ? ` AND username ILIKE '%' || $3 || '%'` : ''}
            ORDER BY created_at ASC
          )
        SELECT
          (SELECT COALESCE((SELECT COUNT(id) FROM user_datas), 0)) AS total,
          (SELECT COALESCE(json_agg(ud.*), '[]')) AS datas
        FROM user_datas ud 
        LIMIT $2 OFFSET $1
        `,
        {
          type: QueryTypes.SELECT,
          benchmark: true,
          bind,
        },
      );

    return {
      total: +total,
      datas: plainToInstance(GetUserDto, datas),
    };
  }
}
