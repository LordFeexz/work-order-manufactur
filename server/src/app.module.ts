import {
  Inject,
  type MiddlewareConsumer,
  Module,
  type NestModule,
  type OnApplicationShutdown,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER, WinstonModule } from 'nest-winston';
import { Sequelize } from 'sequelize-typescript';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { XssSanitize } from './middlewares/xss.middleware';
import { transports, format, Logger } from 'winston';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/users';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/role.guard';
import { WorkOrder } from './models/work_orders';
import { WorkOrderModule } from './modules/workOrder/workOrder.module';
import { WorkTracker } from './models/work_tracker';
import { WorkTrackerModule } from './modules/workTracker/workTracker.module';

const conf = require('../config/config');
const environment = process.env.NODE_ENV ?? 'development';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new transports.Console({
          format: format.combine(
            format.timestamp(),
            format.printf(
              ({ level, message, timestamp }) =>
                `${timestamp} ${level}: ${message}`,
            ),
            format.colorize({ all: true }),
          ),
          level: process.env.LOG_LEVEL ?? 'info',
        }),
      ],
    }),
    SequelizeModule.forRoot({
      username: conf[environment]?.username,
      password: conf[environment]?.password,
      database: conf[environment]?.database,
      host: conf[environment]?.host,
      uri: conf[environment]?.uri,
      logging: environment !== 'production',
      dialect: 'postgres',
      pool: {
        idle: 5,
        max: 20,
        acquire: 10000,
      },
      timezone: '+07:00',
      benchmark: true,
      models: [User, WorkOrder, WorkTracker],
    }),
    UserModule,
    AuthModule,
    WorkOrderModule,
    WorkTrackerModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule, OnApplicationShutdown {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, XssSanitize).forRoutes('*');
  }

  public async onApplicationShutdown() {
    await this.sequelize.close();
    this.logger.info('Database connection closed');
  }

  constructor(
    private readonly sequelize: Sequelize,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}
}
