import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BaseController } from 'src/base/controller.base';
import { RateLimitGuard } from 'src/middlewares/limiter.middleware';
import { LoginBodyPipe, type ILoginBodySchema } from './pipes/login.body.pipe';
import { UserService } from '../user/user.service';
import { globalUtils } from 'src/utils/util.global';
import { jwt } from 'src/utils/util.jwt';

@Controller('auth')
@ApiTags('auth')
export class AuthController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @Post('login')
  @HttpCode(200)
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
  @ApiBody({
    type: 'object',
    required: true,
    schema: {
      properties: {
        username: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
      },
      required: ['username', 'password'],
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
    example: {
      code: 400,
      message: 'Bad Request Exception',
      errors: {
        username: ['[REQUIRED]'],
        password: ['[REQUIRED]'],
      },
      status: 'Bad Request',
      data: null,
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: {
      code: 401,
      message: 'invalid credentials',
      errors: null,
      status: 'Unauthorized',
      data: null,
    },
  })
  @ApiOkResponse({
    description: 'ok',
    example: {
      code: 200,
      message: 'ok',
      errors: null,
      status: 'OK',
      data: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM4NjQ1ZTUxLWI1OTAtNGUwMC1hMThjLWUzMmYxOTNmNzc1OCIsImlhdCI6MTc0MDgwNDE3MiwiZXhwIjoxNzQxMDYzMzcyfQ.Hq8yCiksvN_tTvBN0_lx1JOxdMZRMJwhRNjdksUt2-I',
    },
  })
  public async login(
    @Body(LoginBodyPipe) { username, password }: ILoginBodySchema,
  ) {
    const user = await this.userService.findByUsername(username, { raw: true });
    if (!user || !(await globalUtils.compareHash(password, user.password)))
      throw new UnauthorizedException('invalid credentials');

    return this.sendResponseBody({
      message: 'ok',
      code: 200,
      data: jwt.generateToken(user),
    });
  }
}
