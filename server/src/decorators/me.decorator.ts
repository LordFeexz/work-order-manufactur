import {
  createParamDecorator,
  InternalServerErrorException,
  type ExecutionContext,
} from '@nestjs/common';
import type { Request } from 'express';
import type { IUserAttributes } from 'src/models/users';

export const Me = createParamDecorator(
  (key: keyof IUserAttributes | undefined, ctx: ExecutionContext) => {
    const { user = null } = ctx.switchToHttp().getRequest<Request>();

    if (!user) throw new InternalServerErrorException('user not setted');

    return key ? user?.[key] : user;
  },
);
