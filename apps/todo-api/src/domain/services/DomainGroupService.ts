import { Group } from '../entities/Group';
import { DomainGroupRepository } from '../repositories/DomainGroupRepository';
import { Inject, Injectable } from '@nestjs/common';
import { DOMAIN_GROUP_REPOSITORY } from '../repositories/tokens/tokens';

@Injectable()
export class DomainGroupService {
  constructor(
    @Inject(DOMAIN_GROUP_REPOSITORY)
    private readonly groupRepository: DomainGroupRepository
  ) {}

  async create(entity: Group): Promise<Group> {
    entity.validate();
    return await this.groupRepository.create(entity);
  }

  async update(entity: Group): Promise<Group> {
    entity.validate();
    const currentGroup = await this.groupRepository.readOne(entity.identifier);

    const updatedGroup = new Group({
      ...entity,
      identifier: currentGroup.identifier,
      createdBy: currentGroup.createdBy,
      updatedAt: new Date(),
    });

    return await this.groupRepository.update(updatedGroup);
  }

  async readOne(identifier: string): Promise<Group> {
    return await this.groupRepository.readOne(identifier);
  }

  async readMany(): Promise<Group[]> {
    return await this.groupRepository.readMany();
  }

  async delete(identifier: string): Promise<void> {
    await this.groupRepository.delete(identifier);
  }
}
