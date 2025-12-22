import { Module } from '@nestjs/common';
import { InfraModule } from '../infra/infra.module';
import { UserController } from './controllers/UserController';
import { DomainUserService } from '../domain/services/DomainUserService';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './auth/controllers/AuthController';
import { AuthService } from './auth.service';
import { TaskController } from './controllers/TaskController';
import { DomainTaskService } from '../domain/services/DomainTaskService';

@Module({
  imports: [
    InfraModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [UserController, AuthController, TaskController],
  providers: [
    DomainUserService,
    DomainTaskService,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class ApplicationModule {}
