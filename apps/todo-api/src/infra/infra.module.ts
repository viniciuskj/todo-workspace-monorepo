import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { DomainUserRepository } from '../domain/repositories/DomainUserRepository';
import { PrismaUserRepository } from './repositories/PrismaUserRepository';

@Module({
  providers: [
    PrismaService,
    {
      provide: DomainUserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [PrismaService, DomainUserRepository],
})
export class InfraModule {}
