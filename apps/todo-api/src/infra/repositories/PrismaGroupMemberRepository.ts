import { Injectable } from '@nestjs/common';
import { GroupMember } from '../../domain/entities/GroupMember';
import { DomainGroupMemberRepository } from '../../domain/repositories/DomainGroupMemberRepository';
import { PrismaService } from '../prisma/prisma.service';
import { EntityNotFoundError } from '@my-workspace/core';
import { getRoleTypeFromString } from '../../domain/types/RoleType';

@Injectable()
export class PrismaGroupMemberRepository
  implements DomainGroupMemberRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async create(entity: GroupMember): Promise<GroupMember> {
    entity.validate();

    const createGroupMember = await this.prismaService.groupMember.create({
      data: {
        identifier: entity.identifier,
        role: entity.role,
        joinedAt: entity.joinedAt,
        userIdentifier: entity.userIdentifier,
        groupIdentifier: entity.groupIdentifier,
      },
    });

    return new GroupMember({
      identifier: createGroupMember.identifier,
      role: getRoleTypeFromString(createGroupMember.role),
      userIdentifier: createGroupMember.userIdentifier,
      groupIdentifier: createGroupMember.groupIdentifier,
    });
  }

  async update(entity: GroupMember): Promise<GroupMember> {
    const updatedGroupMember = await this.prismaService.groupMember.update({
      where: { identifier: entity.identifier },
      data: {
        role: entity.role,
        joinedAt: entity.joinedAt,
        userIdentifier: entity.userIdentifier,
        groupIdentifier: entity.groupIdentifier,
      },
    });

    return new GroupMember({
      identifier: updatedGroupMember.identifier,
      role: getRoleTypeFromString(updatedGroupMember.role),
      joinedAt: updatedGroupMember.joinedAt,
      userIdentifier: updatedGroupMember.userIdentifier,
      groupIdentifier: updatedGroupMember.groupIdentifier,
    });
  }

  async readOne(identifier: string): Promise<GroupMember> {
    const groupMember = await this.prismaService.groupMember.findUnique({
      where: { identifier: identifier },
    });

    if (!groupMember) {
      throw new EntityNotFoundError('GroupMember not found');
    }

    return new GroupMember({
      identifier: groupMember.identifier,
      role: getRoleTypeFromString(groupMember.role),
      joinedAt: groupMember.joinedAt,
      userIdentifier: groupMember.userIdentifier,
      groupIdentifier: groupMember.groupIdentifier,
    });
  }

  async readMany(): Promise<GroupMember[]> {
    const groupMembers = await this.prismaService.groupMember.findMany();

    return groupMembers.map(
      (groupMember) =>
        new GroupMember({
          identifier: groupMember.identifier,
          role: getRoleTypeFromString(groupMember.role),
          joinedAt: groupMember.joinedAt,
          userIdentifier: groupMember.userIdentifier,
          groupIdentifier: groupMember.groupIdentifier,
        })
    );
  }

  async delete(identifier: string): Promise<void> {
    await this.prismaService.groupMember.delete({
      where: { identifier: identifier },
    });
  }

  async findByUserAndGroup(
    userIdentifier: string,
    groupIdentifier: string
  ): Promise<GroupMember> {
    const groupMember = await this.prismaService.groupMember.findFirst({
      where: {
        userIdentifier: userIdentifier,
        groupIdentifier: groupIdentifier,
      },
    });

    if (!groupMember) {
      throw new EntityNotFoundError('GroupMember not found');
    }

    return new GroupMember({
      identifier: groupMember.identifier,
      role: getRoleTypeFromString(groupMember.role),
      joinedAt: groupMember.joinedAt,
      userIdentifier: groupMember.userIdentifier,
      groupIdentifier: groupMember.groupIdentifier,
    });
  }
}
