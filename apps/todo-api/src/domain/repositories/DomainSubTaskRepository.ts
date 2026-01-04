import { SubTask } from '../entities/SubTask';

export abstract class DomainSubTaskRepository {
  abstract create(entity: SubTask): Promise<SubTask>;
  abstract update(entity: SubTask): Promise<SubTask>;
  abstract readOne(identifier: string): Promise<SubTask>;
  abstract readMany(taskIdentifier: string): Promise<SubTask[]>;
  abstract delete(identifier: string): Promise<void>;
}
