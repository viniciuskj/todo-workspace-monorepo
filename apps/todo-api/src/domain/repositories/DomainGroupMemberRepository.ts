import { Repository } from '@my-workspace/core';
import { GroupMember } from '../entities/GroupMember';

export interface DomainGroupMemberRepository extends Repository<GroupMember> {
  readOne(identifier: string): Promise<GroupMember>;
  readMany(groupIdentifier: string): Promise<GroupMember[]>;
  findByUserAndGroup(
    userIdentifier: string,
    groupIdentifier: string
  ): Promise<GroupMember>;
}
