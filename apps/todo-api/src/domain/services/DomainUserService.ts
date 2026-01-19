import { Inject, Injectable } from '@nestjs/common';
import { User } from '../entities/User';
import { DomainUserRepository } from '../repositories/DomainUserRepository';
import bcrypt from 'bcrypt';
import { DOMAIN_USER_REPOSITORY } from '../repositories/tokens/tokens';

@Injectable()
export class DomainUserService {
  constructor(
    @Inject(DOMAIN_USER_REPOSITORY)
    private readonly userRepository: DomainUserRepository
  ) {}

  async create(entity: User): Promise<User> {
    entity.validate();

    const hashedPassword = await this.hashPassword(entity.password);

    const user = new User({
      ...entity,
      password: hashedPassword,
    });

    return await this.userRepository.create(user);
  }

  async update(entity: User): Promise<User> {
    entity.validate();

    const currentUser = await this.userRepository.readOne(entity.identifier);

    const updatedUser = new User({
      ...entity,
      identifier: currentUser.identifier,
      createdAt: currentUser.createdAt,
      updatedAt: new Date(),
    });

    if (entity.password) {
      updatedUser.password = await this.hashPassword(entity.password);
    }

    return await this.userRepository.update(updatedUser);
  }

  async readOne(identifier: string): Promise<User> {
    return await this.userRepository.readOne(identifier);
  }

  async readMany(): Promise<User[]> {
    return await this.userRepository.readMany();
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async searchUserByEmail(email: string): Promise<User> {
    return await this.userRepository.searchUserByEmail(email);
  }
}
