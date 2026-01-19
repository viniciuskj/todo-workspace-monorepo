import { Injectable } from '@nestjs/common';
import { Group } from '../../domain/entities/Group';
import { DomainGroupRepository } from '../../domain/repositories/DomainGroupRepository';
import { PrismaService } from '../prisma/prisma.service';
import { EntityNotFoundError } from '@my-workspace/core';

@Injectable()
export class PrismaGroupRepository implements DomainGroupRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(entity: Group): Promise<Group> {
    const createGroup = await this.prismaService.group.create({
      data: {
        identifier: entity.identifier,
        name: entity.name,
        isPersonal: entity.isPersonal,
        createdByIdentifier: entity.createdBy,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      },
    });

    return new Group({
      identifier: createGroup.identifier,
      name: createGroup.name,
      isPersonal: createGroup.isPersonal,
      createdBy: createGroup.createdByIdentifier,
      createdAt: createGroup.createdAt,
      updatedAt: createGroup.updatedAt,
    });
  }

  async update(entity: Group): Promise<Group> {
    const updatedGroup = await this.prismaService.group.update({
      where: { identifier: entity.identifier },
      data: {
        name: entity.name,
        isPersonal: entity.isPersonal,
        createdByIdentifier: entity.createdBy,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      },
    });

    return new Group({
      identifier: updatedGroup.identifier,
      name: updatedGroup.name,
      isPersonal: updatedGroup.isPersonal,
      createdBy: updatedGroup.createdByIdentifier,
      createdAt: updatedGroup.createdAt,
      updatedAt: updatedGroup.updatedAt,
    });
  }

  async readOne(identifier: string): Promise<Group> {
    const group = await this.prismaService.group.findUnique({
      where: { identifier: identifier },
    });

    if (!group) {
      throw new EntityNotFoundError('Group not found');
    }

    return new Group({
      identifier: group.identifier,
      name: group.name,
      isPersonal: group.isPersonal,
      createdBy: group.createdByIdentifier,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
    });
  }

  async readMany(): Promise<Group[]> {
    const groups = await this.prismaService.group.findMany();

    return groups.map(
      (group) =>
        new Group({
          identifier: group.identifier,
          name: group.name,
          isPersonal: group.isPersonal,
          createdBy: group.createdByIdentifier,
          createdAt: group.createdAt,
          updatedAt: group.updatedAt,
        })
    );
  }

  async delete(identifier: string): Promise<void> {
    await this.prismaService.group.delete({
      where: { identifier: identifier },
    });
  }
}
