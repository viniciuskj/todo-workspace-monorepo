import { EntityNotFoundError } from '@my-workspace/core';
import { Task } from '../../domain/entities/Task';
import { DomainTaskRepository } from '../../domain/repositories/DomainTaskRepository';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaTaskRepository implements DomainTaskRepository {
  constructor(private readonly prismaSerivce: PrismaService) {}

  async create(entity: Task): Promise<Task> {
    const newTask = await this.prismaSerivce.task.create({
      data: {
        identifier: entity.identifier,
        title: entity.title,
        description: entity.description,
        completed: entity.completed,
        userIdentifier: entity.userIdentifier,
      },
      select: {
        identifier: true,
        title: true,
        description: true,
        completed: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return new Task({
      identifier: newTask.identifier,
      title: newTask.title,
      description: newTask.description,
      completed: newTask.completed,
      createdAt: newTask.createdAt,
      updatedAt: newTask.updatedAt,
    });
  }

  async update(entity: Task): Promise<Task> {
    const updateTask = await this.prismaSerivce.task.update({
      where: { identifier: entity.identifier },
      data: {
        title: entity.title,
        description: entity.description,
        completed: entity.completed,
      },
      select: {
        identifier: true,
        title: true,
        description: true,
        completed: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return new Task({
      identifier: updateTask.identifier,
      title: updateTask.title,
      description: updateTask.description,
      completed: updateTask.completed,
      createdAt: updateTask.createdAt,
      updatedAt: updateTask.updatedAt,
    });
  }

  async readOne(identifier: string): Promise<Task> {
    const task = await this.prismaSerivce.task.findUnique({
      where: { identifier },
    });

    if (!task) {
      throw new EntityNotFoundError('Task not found');
    }

    return new Task({
      identifier: task.identifier,
      title: task.title,
      description: task.description,
      completed: task.completed,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    });
  }

  async readMany(userIdentifier: string): Promise<Task[]> {
    const tasks = await this.prismaSerivce.task.findMany({
      where: { userIdentifier },
      orderBy: { createdAt: 'desc' },
    });

    return tasks.map(
      (task) =>
        new Task({
          identifier: task.identifier,
          title: task.title,
          description: task.description,
          completed: task.completed,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        })
    );
  }

  async delete(identifier: string): Promise<void> {
    await this.prismaSerivce.task.delete({
      where: { identifier },
    });
  }
}
