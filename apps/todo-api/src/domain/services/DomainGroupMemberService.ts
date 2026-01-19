import { Inject, Injectable } from '@nestjs/common';
import { GroupMember } from '../entities/GroupMember';
import { DomainGroupMemberRepository } from '../repositories/DomainGroupMemberRepository';
import { DOMAIN_GROUPMEMBER_REPOSITORY } from '../repositories/tokens/tokens';

@Injectable()
export class DomainGroupMemberService {
  constructor(
    @Inject(DOMAIN_GROUPMEMBER_REPOSITORY)
    private readonly groupMemberRepository: DomainGroupMemberRepository
  ) {}

  async create(entity: GroupMember): Promise<GroupMember> {
    return await this.groupMemberRepository.create(entity);
  }

  async update(entity: GroupMember): Promise<GroupMember> {
    return await this.groupMemberRepository.update(entity);
  }

  async delete(identifier: string): Promise<void> {
    await this.groupMemberRepository.delete(identifier);
  }

  async readOne(identifier: string): Promise<GroupMember> {
    return await this.groupMemberRepository.readOne(identifier);
  }

  async readMany(groupIdentifier: string): Promise<GroupMember[]> {
    return await this.groupMemberRepository.readMany(groupIdentifier);
  }
}
