import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/User';
import { DomainUserRepository } from '../../domain/repositories/DomainUserRepository';
import { PrismaService } from '../prisma/prisma.service';
import { EntityNotFoundError } from '@my-workspace/core';

@Injectable()
export class PrismaUserRepository implements DomainUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(entity: User): Promise<User> {
    const newUser = await this.prismaService.user.create({
      data: {
        identifier: entity.identifier,
        name: entity.name,
        email: entity.email,
        password: entity.password,
      },
      select: {
        identifier: true,
        name: true,
        email: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return new User({
      identifier: newUser.identifier,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    });
  }

  async update(entity: User): Promise<User> {
    const updatedUser = await this.prismaService.user.update({
      where: { identifier: entity.identifier },
      data: {
        name: entity.name,
        email: entity.email,
        password: entity.password,
      },
      select: {
        identifier: true,
        name: true,
        email: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return new User({
      identifier: updatedUser.identifier,
      name: updatedUser.name,
      email: updatedUser.email,
      password: updatedUser.password,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    });
  }

  async readOne(identifier: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { identifier: identifier },
      select: {
        identifier: true,
        name: true,
        email: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new EntityNotFoundError('User not found');
    }

    return new User({
      identifier: user.identifier,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async readMany(): Promise<User[]> {
    const users = await this.prismaService.user.findMany({
      select: {
        identifier: true,
        name: true,
        email: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return users.map(
      (user) =>
        new User({
          identifier: user.identifier,
          name: user.name,
          email: user.email,
          password: user.password,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })
    );
  }

  async searchUserByEmail(email: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { email: email },
      select: {
        identifier: true,
        name: true,
        email: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new EntityNotFoundError('User not found');
    }

    return new User({
      identifier: user.identifier,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
