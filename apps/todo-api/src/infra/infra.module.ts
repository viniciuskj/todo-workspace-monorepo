import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaUserRepository } from './repositories/PrismaUserRepository';
import { PrismaTaskRepository } from './repositories/PrismaTaskRepository';
import { PrismaSubTaskRepository } from './repositories/PrismaSubTaskRepository';
import { PrismaCommentRepository } from './repositories/PrismaCommentRepository';
import { PrismaGroupMemberRepository } from './repositories/PrismaGroupMemberRepository';
import {
  DOMAIN_USER_REPOSITORY,
  DOMAIN_TASK_REPOSITORY,
  DOMAIN_SUBTASK_REPOSITORY,
  DOMAIN_COMMENT_REPOSITORY,
  DOMAIN_GROUP_REPOSITORY,
  DOMAIN_GROUPMEMBER_REPOSITORY,
} from '../domain/repositories/tokens/tokens';

@Module({
  providers: [
    PrismaService,
    {
      provide: DOMAIN_USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    {
      provide: DOMAIN_TASK_REPOSITORY,
      useClass: PrismaTaskRepository,
    },
    {
      provide: DOMAIN_SUBTASK_REPOSITORY,
      useClass: PrismaSubTaskRepository,
    },
    {
      provide: DOMAIN_COMMENT_REPOSITORY,
      useClass: PrismaCommentRepository,
    },
    {
      provide: DOMAIN_GROUP_REPOSITORY,
      useClass: PrismaGroupMemberRepository,
    },
    {
      provide: DOMAIN_GROUPMEMBER_REPOSITORY,
      useClass: PrismaGroupMemberRepository,
    },
  ],
  exports: [
    PrismaService,
    DOMAIN_USER_REPOSITORY,
    DOMAIN_TASK_REPOSITORY,
    DOMAIN_SUBTASK_REPOSITORY,
    DOMAIN_COMMENT_REPOSITORY,
    DOMAIN_GROUP_REPOSITORY,
    DOMAIN_GROUPMEMBER_REPOSITORY,
  ],
})
export class InfraModule {}
