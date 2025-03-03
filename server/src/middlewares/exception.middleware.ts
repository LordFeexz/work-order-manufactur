import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import type { Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import {
  ConnectionError,
  HostNotFoundError,
  HostNotReachableError,
} from 'sequelize';
import { BaseController } from '../base/controller.base';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Catch()
export class AllExceptionFilter
  extends BaseController
  implements ExceptionFilter
{
  public catch(exception: HttpException | Error, host: ArgumentsHost) {
    let errors = null;
    let message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal Server Error';
    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof JsonWebTokenError) {
      status = HttpStatus.UNAUTHORIZED;
      message = 'missing or invalid authorization';
    }

    if (exception instanceof TokenExpiredError) {
      status = HttpStatus.UNAUTHORIZED;
      message = 'token expired';
    }

    if (
      exception instanceof HostNotFoundError ||
      exception instanceof HostNotReachableError ||
      exception instanceof ConnectionError
    ) {
      status = HttpStatus.GATEWAY_TIMEOUT;
      message = 'database connection lost';
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR)
      this.logger.error(`unexpected error occurred: ${exception}`);

    if (
      status === HttpStatus.BAD_REQUEST &&
      exception instanceof BadRequestException
    ) {
      let errorData = exception.getResponse().valueOf();
      if (errorData.hasOwnProperty('VALIDATION')) {
        errorData['VALIDATION'] = undefined;
        errors = errorData;
      }
    }

    host
      .switchToHttp()
      .getResponse<Response>()
      .status(status)
      .json(this.sendResponseBody({ message, code: status, errors }));
  }

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    super();
  }
}
