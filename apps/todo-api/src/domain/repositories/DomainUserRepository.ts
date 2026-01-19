import { Repository } from '@my-workspace/core';
import { User } from '../entities/User';

export interface DomainUserRepository extends Repository<User> {
  readOne(identifier: string): Promise<User>;
  readMany(): Promise<User[]>;
  searchUserByEmail(email: string): Promise<User>;
}
