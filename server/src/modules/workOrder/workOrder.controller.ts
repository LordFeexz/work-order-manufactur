import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { BaseController } from 'src/base/controller.base';
import { Roles } from 'src/decorators/role.decorator';
import { RateLimitGuard } from 'src/middlewares/limiter.middleware';
import { type IUserAttributes, USER_ROLE } from 'src/models/users';
import { CreateWOPipe, type ICreateWoSchema } from './pipes/createWO.pipe';
import { RequiredFieldPipe } from 'src/pipes/required.pipe';
import { TypePipe } from 'src/pipes/type.pipe';
import { UserFindByIdPipe } from '../user/pipes/findById.pipe';
import { WorkOrderService } from './workOrder.service';
import { Sequelize } from 'sequelize-typescript';
import { Me } from 'src/decorators/me.decorator';
import { WorkTrackerService } from '../workTracker/workTracker.service';
import { InitialCreateWorkTrackerDto } from '../workTracker/dto/create.dto';
import { CreateWODto } from './dto/create.dto';

@Controller('work-orders')
@ApiTags('Work Orders')
@ApiBearerAuth('authorization')
export class WorkOrderController extends BaseController {
  constructor(
    private readonly workOrderService: WorkOrderService,
    private readonly sequelize: Sequelize,
    private readonly workTrackerService: WorkTrackerService,
  ) {
    super();
  }

  @Post()
  @HttpCode(201)
  @UseGuards(
    new RateLimitGuard({
      windowMs: 1 * 60 * 1000,
      max: 5,
      message: 'Too many requests from this IP, please try again in 1 minute.',
    }),
  )
  @ApiTooManyRequestsResponse({
    description:
      'Too many requests from this IP, please try again in 1 minute.',
  })
  @Roles(USER_ROLE.PRODUCT_MANAGER)
  @ApiOperation({
    summary: 'Create work order',
    tags: [USER_ROLE.PRODUCT_MANAGER],
  })
  @ApiBody({
    type: 'object',
    required: true,
    schema: {
      properties: {
        name: {
          type: 'string',
        },
        amount: {
          type: 'number',
        },
        deadline: {
          type: 'string',
          format: 'date-time',
        },
        operatorId: {
          type: 'string',
          format: 'uuid',
        },
      },
      required: ['name', 'amount', 'deadline', 'operatorId'],
      example: {
        name: 'Emas',
        amount: 10,
        deadline: '2025-04-03T01:16:48.151Z',
        operatorId: '27c95272-0eb0-4297-8cf9-ed94df8e4a6f',
      },
    },
  })
  @ApiConsumes('application/json')
  @ApiBadRequestResponse({
    description: 'Bad Request',
    example: {
      code: 400,
      message: 'Bad Request Exception',
      errors: {
        name: ['[REQUIRED]'],
        amount: ['[INVALID_TYPE]'],
        deadline: ['Invalid date'],
        operatorId: ['[REQUIRED]'],
      },
      status: 'Bad Request',
      data: null,
    },
  })
  @ApiNotFoundResponse({
    description: 'not found',
    example: {
      code: 404,
      message: 'operator not found',
      errors: null,
      status: 'Not Found',
      data: null,
    },
  })
  @ApiConflictResponse({
    description: 'conflict',
    example: {
      code: 409,
      message: 'order must assigned to an operator',
      errors: null,
      status: 'Conflict',
      data: null,
    },
  })
  @ApiCreatedResponse({
    description: 'created',
    example: {
      code: 201,
      message: 'created',
      errors: null,
      status: 'Created',
      data: {
        no: 'WO-20250303-003',
        name: 'Emas',
        status: 'Pending',
        amount: 10,
        operator_id: '27c95272-0eb0-4297-8cf9-ed94df8e4a6f',
        created_by: '38645e51-b590-4e00-a18c-e32f193f7758',
      },
    },
  })
  public async create(
    @Body(
      'operatorId',
      RequiredFieldPipe,
      new TypePipe('string'),
      new ParseUUIDPipe({ version: '4' }),
      UserFindByIdPipe,
    )
    operator: IUserAttributes | null,
    @Body(CreateWOPipe) { name, amount, deadline }: ICreateWoSchema,
    @Me('id') id: string,
  ) {
    if (!operator) throw new NotFoundException('operator not found');
    if (operator.role !== USER_ROLE.OPERATOR)
      throw new ConflictException('order must assigned to an operator');

    const transaction = await this.sequelize.transaction();
    try {
      const wo = await this.workOrderService.create(
        new CreateWODto({
          counter: await this.workOrderService.getWorkOrderCounter(),
          name,
          amount,
          deadline,
          operator_id: operator.id,
          created_by: id,
        }),
        {
          transaction,
          raw: true,
        },
      );

      await this.workTrackerService.create(
        new InitialCreateWorkTrackerDto({
          work_order_number: wo.no,
          updated_by: id,
        }),
        { transaction, raw: true },
      );

      await transaction.commit();
      return this.sendResponseBody({
        message: 'created',
        code: 201,
        data: {
          no: wo.no,
          name: wo.name,
          status: wo.status,
          amount: wo.amount,
          operator_id: wo.operator_id,
          created_by: wo.created_by,
        },
      });
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}
