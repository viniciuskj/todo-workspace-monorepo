import { Repository } from '@my-workspace/core';
import { Group } from '../entities/Group';

export interface DomainGroupRepository extends Repository<Group> {
  readOne(identifier: string): Promise<Group>;
  readMany(): Promise<Group[]>;
}
