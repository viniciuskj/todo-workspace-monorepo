import { Task } from '../entities/Task';

export abstract class DomainTaskRepository {
  abstract create(entity: Task): Promise<Task>;
  abstract update(entity: Task): Promise<Task>;
  abstract readOne(identifier: string): Promise<Task>;
  abstract readMany(userIdentifier: string): Promise<Task[]>;
  abstract delete(identifier: string): Promise<void>;
}
