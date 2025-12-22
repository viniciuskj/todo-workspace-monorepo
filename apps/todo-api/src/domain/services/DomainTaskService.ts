import { Injectable } from '@nestjs/common';
import { Task } from '../entities/Task';
import { DomainTaskRepository } from '../repositories/DomainTaskRepository';

@Injectable()
export class DomainTaskService {
  constructor(private readonly taskRepository: DomainTaskRepository) {}

  async create(entity: Task): Promise<Task> {
    entity.validate();

    return await this.taskRepository.create(entity);
  }

  async update(entity: Task): Promise<Task> {
    entity.validate();

    const currentTask = await this.taskRepository.readOne(entity.identifier);

    const updatedTask = new Task({
      ...entity,
      identifier: currentTask.identifier,
      createdAt: currentTask.createdAt,
      updatedAt: new Date(),
    });

    return await this.taskRepository.update(updatedTask);
  }

  async readOne(identifier: string): Promise<Task> {
    return await this.taskRepository.readOne(identifier);
  }

  async readMany(userIdentifier: string): Promise<Task[]> {
    return await this.taskRepository.readMany(userIdentifier);
  }

  async delete(identifier: string): Promise<void> {
    await this.taskRepository.delete(identifier);
  }
}
