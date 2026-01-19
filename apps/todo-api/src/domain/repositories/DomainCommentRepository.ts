import { Repository } from '@my-workspace/core';
import { Comment } from '../entities/Comment';

export interface DomainCommentRepository extends Repository<Comment> {
  readOne(identifer: string): Promise<Comment>;
  readMany(taskIdentifier: string): Promise<Comment[]>;
}
