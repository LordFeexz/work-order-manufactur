import { Inject, Injectable, type NestMiddleware } from '@nestjs/common';
import type { RequestHandler } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  public use: RequestHandler = (req, res, next) => {
    const startTime = Date.now();
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent');

    res.on('finish', () => {
      const endTime = Date.now();
      const { statusCode } = res;
      const contentLength = res.get('content-length') ?? 0;
      const message = `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`;

      this.logger.info({ message });

      const duration = endTime - startTime;
      if (duration > 1000)
        this.logger.warn({
          message: `Slow request ${duration}ms : ${message}`,
          meta: {
            duration,
            startTime,
            endTime,
          },
        });
    });
    next();
  };

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}
}
