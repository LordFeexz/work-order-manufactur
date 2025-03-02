import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { BaseController } from 'src/base/controller.base';
import { Roles } from 'src/decorators/role.decorator';
import { USER_ROLE } from 'src/models/users';
import { type IBaseQuery, QueryPipe } from 'src/pipes/query.pipe';
import { getOperatorSchema, type IGetOperatorSchema } from './user.schema';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('user')
@ApiBearerAuth('authorization')
export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @Get()
  @HttpCode(200)
  @Roles(USER_ROLE.PRODUCT_MANAGER)
  @ApiOperation({
    summary: 'get operator list',
    tags: [USER_ROLE.PRODUCT_MANAGER],
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    default: 1,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    default: 10,
  })
  @ApiQuery({
    name: 'q',
    type: String,
    required: false,
    description: 'query search params',
  })
  @ApiOkResponse({
    description: 'ok',
    example: {
      code: 200,
      message: 'ok',
      errors: null,
      status: 'OK',
      data: [
        {
          id: '27c95272-0eb0-4297-8cf9-ed94df8e4a6f',
          username: 'udin',
        },
      ],
      page: 1,
      limit: 10,
      totalData: 1,
      totalPage: 1,
    },
  })
  public async getUserData(
    @Query(new QueryPipe(1, 10, getOperatorSchema))
    { page = 1, limit = 10, q = null }: IBaseQuery<IGetOperatorSchema>,
  ) {
    const { total = 0, datas = [] } = await this.userService.findUser({
      page,
      limit,
      q,
    });

    return this.sendResponseBody(
      {
        message: 'ok',
        code: 200,
        data: datas,
      },
      {
        page,
        limit,
        totalData: total,
        totalPage: Math.ceil(total / limit),
      },
    );
  }
}
