import { Injectable } from '@nestjs/common';
import { DomainCommentRepository } from '../../domain/repositories/DomainCommentRepository';
import { PrismaService } from '../prisma/prisma.service';
import { Comment } from '../../domain/entities/Comment';

@Injectable()
export class PrismaCommentRepository implements DomainCommentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(entity: Comment): Promise<Comment> {
    const createdComment = await this.prismaService.comment.create({
      data: {
        identifier: entity.identifier,
        content: entity.content,
        taskIdentifier: entity.taskIdentifier,
        authorIdentifier: entity.authorIdentifier,
      },
      select: {
        identifier: true,
        content: true,
        taskIdentifier: true,
        authorIdentifier: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return new Comment({
      identifier: createdComment.identifier,
      content: createdComment.content,
      taskIdentifier: createdComment.taskIdentifier,
      authorIdentifier: createdComment.authorIdentifier,
      createdAt: createdComment.createdAt,
      updatedAt: createdComment.updatedAt,
    });
  }

  async readOne(identifier: string): Promise<Comment> {
    const comment = await this.prismaService.comment.findUnique({
      where: { identifier: identifier },
      select: {
        identifier: true,
        authorIdentifier: true,
        content: true,
        taskIdentifier: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return new Comment({
      identifier: comment.identifier,
      content: comment.content,
      taskIdentifier: comment.taskIdentifier,
      authorIdentifier: comment.authorIdentifier,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    });
  }

  async update(entity: Comment): Promise<Comment> {
    const updatedComment = await this.prismaService.comment.update({
      where: { identifier: entity.identifier },
      data: {
        content: entity.content,
      },
    });

    return new Comment({
      identifier: updatedComment.identifier,
      content: updatedComment.content,
      taskIdentifier: updatedComment.taskIdentifier,
      authorIdentifier: updatedComment.authorIdentifier,
      createdAt: updatedComment.createdAt,
      updatedAt: updatedComment.updatedAt,
    });
  }

  async readMany(taskIdentifier: string): Promise<Comment[]> {
    const comments = await this.prismaService.comment.findMany({
      where: { taskIdentifier: taskIdentifier },
      select: {
        identifier: true,
        content: true,
        taskIdentifier: true,
        authorIdentifier: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return comments.map((comment) => {
      return new Comment({
        identifier: comment.identifier,
        content: comment.content,
        taskIdentifier: comment.taskIdentifier,
        authorIdentifier: comment.authorIdentifier,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      });
    });
  }

  async delete(identifier: string): Promise<void> {
    await this.prismaService.comment.delete({
      where: { identifier: identifier },
    });
  }
}
