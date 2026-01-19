import { Injectable } from '@nestjs/common';
import { SubTask } from '../../domain/entities/SubTask';
import { DomainSubTaskRepository } from '../../domain/repositories/DomainSubTaskRepository';
import { PrismaService } from '../prisma/prisma.service';
import { EntityNotFoundError } from '@my-workspace/core';

@Injectable()
export class PrismaSubTaskRepository implements DomainSubTaskRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(entity: SubTask): Promise<SubTask> {
    const createdSubTask = await this.prismaService.subTask.create({
      data: {
        identifier: entity.identifier,
        title: entity.title,
        description: entity.description,
        completed: entity.completed,
        createdByIdentifier: entity.createdBy,
        taskIdentifier: entity.taskIdentifier,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      },
    });

    return new SubTask({
      identifier: createdSubTask.identifier,
      title: createdSubTask.title,
      description: createdSubTask.description,
      completed: createdSubTask.completed,
      createdBy: createdSubTask.createdByIdentifier,
      taskIdentifier: createdSubTask.taskIdentifier,
      createdAt: createdSubTask.createdAt,
      updatedAt: createdSubTask.updatedAt,
    });
  }

  async update(entity: SubTask): Promise<SubTask> {
    const updatedSubTask = await this.prismaService.subTask.update({
      where: { identifier: entity.identifier },
      data: {
        title: entity.title,
        description: entity.description,
        completed: entity.completed,
        createdByIdentifier: entity.createdBy,
        taskIdentifier: entity.taskIdentifier,
        updatedAt: entity.updatedAt,
      },
    });

    return new SubTask({
      identifier: updatedSubTask.identifier,
      title: updatedSubTask.title,
      description: updatedSubTask.description,
      completed: updatedSubTask.completed,
      createdBy: updatedSubTask.createdByIdentifier,
      taskIdentifier: updatedSubTask.taskIdentifier,
      createdAt: updatedSubTask.createdAt,
      updatedAt: updatedSubTask.updatedAt,
    });
  }

  async readOne(identifier: string): Promise<SubTask> {
    const subTask = await this.prismaService.subTask.findUnique({
      where: { identifier },
    });

    if (!subTask) {
      throw new EntityNotFoundError('SubTask not found');
    }

    return new SubTask({
      identifier: subTask.identifier,
      title: subTask.title,
      description: subTask.description,
      completed: subTask.completed,
      createdBy: subTask.createdByIdentifier,
      taskIdentifier: subTask.taskIdentifier,
      createdAt: subTask.createdAt,
      updatedAt: subTask.updatedAt,
    });
  }

  async readMany(taskIdentifier: string): Promise<SubTask[]> {
    const subtasks = await this.prismaService.subTask.findMany({
      where: { taskIdentifier: taskIdentifier },
    });

    return subtasks.map((subTask) => {
      return new SubTask({
        identifier: subTask.identifier,
        title: subTask.title,
        description: subTask.description,
        completed: subTask.completed,
        createdBy: subTask.createdByIdentifier,
        taskIdentifier: subTask.taskIdentifier,
        createdAt: subTask.createdAt,
        updatedAt: subTask.updatedAt,
      });
    });
  }

  async delete(identifier: string): Promise<void> {
    await this.prismaService.subTask.delete({
      where: { identifier },
    });
  }
}
