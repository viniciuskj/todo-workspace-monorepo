import { User } from '../entities/User';

export abstract class DomainUserRepository {
  abstract create(entity: User): Promise<User>;
  abstract update(entity: User): Promise<User>;
  abstract readOne(identifier: string): Promise<User>;
  abstract readMany(): Promise<User[]>;
  abstract searchUserByEmail(email: string): Promise<User>;
}
