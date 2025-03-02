import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import type { Request } from 'express';
import { USER_ROLE } from 'src/models/users';
import { ROLES_KEY } from 'src/decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<USER_ROLE[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest<Request>();

    if (!requiredRoles.some((role) => role === user.role))
      throw new ForbiddenException('forbidden');

    return true;
  }

  constructor(private readonly reflector: Reflector) {}
}
