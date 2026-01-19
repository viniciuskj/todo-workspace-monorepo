import { Repository } from '@my-workspace/core';
import { Task } from '../entities/Task';

export interface DomainTaskRepository extends Repository<Task> {
  readOne(identifier: string): Promise<Task[]>;
  readMany(userIdentifier: string): Promise<Task[]>;
}
