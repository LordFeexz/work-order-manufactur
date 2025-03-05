import {
  Global,
  type MiddlewareConsumer,
  Module,
  type NestModule,
} from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models/users';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Authentication } from 'src/middlewares/authentication.middleware';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(Authentication).forRoutes(UserController);
  }
}
