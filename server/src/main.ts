import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionFilter } from './middlewares/exception.middleware';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { GlobalLimiter } from './middlewares/globalLimiter.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('/api/v1');
  app.useGlobalFilters(
    new AllExceptionFilter(app.get(WINSTON_MODULE_PROVIDER)),
  );
  app.use(new GlobalLimiter().use);
  app.getHttpAdapter().getInstance().set('trust proxy', 1);
  app.enableShutdownHooks();

  app.enableCors();

  app.use(
    helmet({
      referrerPolicy: { policy: 'same-origin' },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        },
      },
    }),
  );

  // if (process.env.NODE_ENV === 'development') //uncomment this part to only activate swagger on dev environment
  SwaggerModule.setup(
    'docs',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder().setTitle('Work Order Manufactur API').build(),
      {
        operationIdFactory: (controllerKey: string, methodKey: string) =>
          methodKey,
      },
    ),
  );
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
