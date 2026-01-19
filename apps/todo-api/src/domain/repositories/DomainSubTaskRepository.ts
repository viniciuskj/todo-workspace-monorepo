import { Repository } from '@my-workspace/core';
import { SubTask } from '../entities/SubTask';

export interface DomainSubTaskRepository extends Repository<SubTask> {
  readOne(identifier: string): Promise<SubTask>;
  readMany(taskIdentifier: string): Promise<SubTask[]>;
}
