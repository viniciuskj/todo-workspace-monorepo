import { Inject, Injectable } from '@nestjs/common';
import { Comment } from '../entities/Comment';
import { DomainCommentRepository } from '../repositories/DomainCommentRepository';
import { DOMAIN_COMMENT_REPOSITORY } from '../repositories/tokens/tokens';

@Injectable()
export class DomainCommentService {
  constructor(
    @Inject(DOMAIN_COMMENT_REPOSITORY)
    private readonly commentRepository: DomainCommentRepository
  ) {}

  async create(entity: Comment): Promise<Comment> {
    entity.validate();
    return await this.commentRepository.create(entity);
  }

  async update(entity: Comment): Promise<Comment> {
    entity.validate();

    const currentComment = await this.commentRepository.readOne(
      entity.identifier
    );

    const updatedComment = new Comment({
      ...entity,
      author: currentComment.author,
      taskIdentifier: currentComment.taskIdentifier,
    });

    return await this.commentRepository.update(updatedComment);
  }

  async readOne(identifier: string): Promise<Comment> {
    return await this.commentRepository.readOne(identifier);
  }

  async readMany(taskIdentifier: string): Promise<Comment[]> {
    return await this.commentRepository.readMany(taskIdentifier);
  }

  async delete(identifier: string): Promise<void> {
    await this.commentRepository.delete(identifier);
  }
}
