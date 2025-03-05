import {
  Injectable,
  UnauthorizedException,
  type NestMiddleware,
} from '@nestjs/common';
import type { RequestHandler } from 'express';
import { UserService } from 'src/modules/user/user.service';
import { jwt } from 'src/utils/util.jwt';

@Injectable()
export class Authentication implements NestMiddleware {
  public use: RequestHandler = async (req, _, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer '))
      throw new UnauthorizedException('missing or invalid authorization');

    const [, token] = authorization.split(' ');
    if (!token)
      throw new UnauthorizedException('missing or invalid authorization');

    const { id, role } = jwt.verifyToken(token);
    const user = await this.userService.findById(id, { raw: true });
    if (!user || user.role !== role)
      throw new UnauthorizedException('missing or invalid authorization');

    req.user = user;

    next();
  };

  constructor(private readonly userService: UserService) {}
}
