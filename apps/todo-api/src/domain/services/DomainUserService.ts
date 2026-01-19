import { Inject, Injectable } from '@nestjs/common';
import { User } from '../entities/User';
import { DomainUserRepository } from '../repositories/DomainUserRepository';
import bcrypt from 'bcrypt';
import {
  DOMAIN_GROUPMEMBER_REPOSITORY,
  DOMAIN_USER_REPOSITORY,
} from '../repositories/tokens/tokens';
import { DomainGroupRepository } from '../repositories/DomainGroupRepository';
import { DOMAIN_GROUP_REPOSITORY } from '../repositories/tokens/tokens';
import { Group } from '../entities/Group';
import { DomainGroupMemberRepository } from '../repositories/DomainGroupMemberRepository';
import { RoleType } from '../types/RoleType';
import { GroupMember } from '../entities/GroupMember';

@Injectable()
export class DomainUserService {
  constructor(
    @Inject(DOMAIN_USER_REPOSITORY)
    private readonly userRepository: DomainUserRepository,
    @Inject(DOMAIN_GROUP_REPOSITORY)
    private readonly groupRepository: DomainGroupRepository,
    @Inject(DOMAIN_GROUPMEMBER_REPOSITORY)
    private readonly groupMemberRepository: DomainGroupMemberRepository
  ) {}

  async create(entity: User): Promise<User> {
    entity.validate();

    const hashedPassword = await this.hashPassword(entity.password);

    const user = new User({
      ...entity,
      password: hashedPassword,
    });

    const createdUser = await this.userRepository.create(user);

    const group = new Group({
      name: 'Default',
      isPersonal: true,
      createdBy: createdUser.identifier,
    });

    const createdGroup = await this.groupRepository.create(group);

    const groupMember = new GroupMember({
      role: RoleType.OWNER,
      userIdentifier: createdUser.identifier,
      groupIdentifier: createdGroup.identifier,
    });

    await this.groupMemberRepository.create(groupMember);

    return createdUser;
  }

  async update(entity: User): Promise<User> {
    entity.validate();

    const currentUser = await this.userRepository.readOne(entity.identifier);

    const updatedUser = new User({
      ...entity,
      identifier: currentUser.identifier,
      createdAt: currentUser.createdAt,
      updatedAt: new Date(),
    });

    if (entity.password) {
      updatedUser.password = await this.hashPassword(entity.password);
    }

    return await this.userRepository.update(updatedUser);
  }

  async readOne(identifier: string): Promise<User> {
    return await this.userRepository.readOne(identifier);
  }

  async readMany(): Promise<User[]> {
    return await this.userRepository.readMany();
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async searchUserByEmail(email: string): Promise<User> {
    return await this.userRepository.searchUserByEmail(email);
  }
}
