import { Inject, Injectable } from '@nestjs/common';
import { SubTask } from '../entities/SubTask';
import { DomainSubTaskRepository } from '../repositories/DomainSubTaskRepository';
import { DomainTaskRepository } from '../repositories/DomainTaskRepository';
import { EntityNotFoundError } from '@my-workspace/core';
import {
  DOMAIN_SUBTASK_REPOSITORY,
  DOMAIN_TASK_REPOSITORY,
} from '../repositories/tokens/tokens';

@Injectable()
export class DomainSubTaskService {
  constructor(
    @Inject(DOMAIN_SUBTASK_REPOSITORY)
    private readonly subTaskRepository: DomainSubTaskRepository,
    @Inject(DOMAIN_TASK_REPOSITORY)
    private readonly taskRepository: DomainTaskRepository
  ) {}

  async create(entity: SubTask): Promise<SubTask> {
    entity.validate();
    const task = await this.taskRepository.readOne(entity.taskIdentifier);

    if (!task) {
      throw new EntityNotFoundError('Task not found');
    }

    return this.subTaskRepository.create(entity);
  }

  async update(entity: SubTask): Promise<SubTask> {
    entity.validate();

    const currentSubTask = await this.subTaskRepository.readOne(
      entity.identifier
    );

    const updatedSubTask = new SubTask({
      ...entity,
      identifier: currentSubTask.identifier,
      createdAt: currentSubTask.createdAt,
      taskIdentifier: currentSubTask.taskIdentifier,
      createdBy: currentSubTask.createdBy,
      updatedAt: new Date(),
    });

    return this.subTaskRepository.update(updatedSubTask);
  }

  async readOne(identifier: string): Promise<SubTask> {
    return this.subTaskRepository.readOne(identifier);
  }

  async readMany(taskIdentifier: string): Promise<SubTask[]> {
    return this.subTaskRepository.readMany(taskIdentifier);
  }

  async delete(identifier: string): Promise<void> {
    return this.subTaskRepository.delete(identifier);
  }
}
