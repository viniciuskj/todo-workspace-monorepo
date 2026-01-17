import { Comment } from '../entities/Comment';

export abstract class DomainCommentRepository {
  abstract create(entity: Comment): Promise<Comment>;
  abstract update(entity: Comment): Promise<Comment>;
  abstract readOne(identifier: string): Promise<Comment>;
  abstract readMany(taskIdentifier: string): Promise<Comment[]>;
  abstract delete(identifier: string): Promise<void>;
}
