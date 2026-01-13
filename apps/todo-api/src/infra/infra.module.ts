import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { DomainUserRepository } from '../domain/repositories/DomainUserRepository';
import { PrismaUserRepository } from './repositories/PrismaUserRepository';
import { DomainTaskRepository } from '../domain/repositories/DomainTaskRepository';
import { PrismaTaskRepository } from './repositories/PrismaTaskRepository';
import { DomainSubTaskRepository } from '../domain/repositories/DomainSubTaskRepository';
import { PrismaSubTaskRepository } from './repositories/PrismaSubTaskRepository';
import { DomainCommentRepository } from '../domain/repositories/DomainCommentRepository';
import { PrismaCommentRepository } from './repositories/PrismaCommentRepository';

@Module({
  providers: [
    PrismaService,
    {
      provide: DomainUserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: DomainTaskRepository,
      useClass: PrismaTaskRepository,
    },
    {
      provide: DomainSubTaskRepository,
      useClass: PrismaSubTaskRepository,
    },
    {
      provide: DomainCommentRepository,
      useClass: PrismaCommentRepository,
    },
  ],
  exports: [
    PrismaService,
    DomainUserRepository,
    DomainTaskRepository,
    DomainSubTaskRepository,
    DomainCommentRepository,
  ],
})
export class InfraModule {}
