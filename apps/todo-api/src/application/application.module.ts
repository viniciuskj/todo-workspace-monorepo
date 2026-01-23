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
import { SubTaskController } from './controllers/SubTaskController';
import { DomainSubTaskService } from '../domain/services/DomainSubTaskService';
import { CommentController } from './controllers/CommentController';
import { DomainCommentService } from '../domain/services/DomainCommentService';
import { GroupAccessGuard } from './auth/auth.group.guard';
import { GroupController } from './controllers/GroupController';
import { DomainGroupMemberService } from '../domain/services/DomainGroupMemberService';
import { GrouMemberController } from './controllers/GrouMemberController';
import { DomainGroupService } from '../domain/services/DomainGroupService';

@Module({
  imports: [
    InfraModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [
    UserController,
    AuthController,
    TaskController,
    SubTaskController,
    CommentController,
    GroupController,
    GrouMemberController,
  ],
  providers: [
    DomainUserService,
    DomainTaskService,
    DomainSubTaskService,
    DomainCommentService,
    DomainGroupMemberService,
    DomainGroupService,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: GroupAccessGuard,
    },
  ],
})
export class ApplicationModule {}
