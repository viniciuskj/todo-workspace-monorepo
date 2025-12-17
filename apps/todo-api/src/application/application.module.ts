import { Module } from '@nestjs/common';
import { InfraModule } from '../infra/infra.module';
import { UserController } from './controllers/UserController';
import { DomainUserService } from '../domain/services/DomainUserService';

@Module({
  imports: [InfraModule],
  controllers: [UserController],
  providers: [DomainUserService],
})
export class ApplicationModule {}
