import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { DomainUserRepository } from '../domain/repositories/DomainUserRepository';
import { PrismaUserRepository } from './repositories/PrismaUserRepository';
import { DomainTaskRepository } from '../domain/repositories/DomainTaskRepository';
import { PrismaTaskRepository } from './repositories/PrismaTaskRepository';

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
  ],
  exports: [PrismaService, DomainUserRepository, DomainTaskRepository],
})
export class InfraModule {}
