import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';
import { DomainGroupMemberRepository } from '../../domain/repositories/DomainGroupMemberRepository';
import { Request } from 'express';

@Injectable()
export class GroupAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly groupMemberRepository: DomainGroupMemberRepository
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    const groupIdentifier =
      request.body?.groupIdentifier ??
      request.params?.groupIdentifier ??
      request.query?.groupIdentifier;

    if (!groupIdentifier) {
      throw new BadRequestException('groupIdentifier is required');
    }

    const membership = await this.groupMemberRepository.findByUserAndGroup(
      request.user.identifier,
      groupIdentifier
    );

    if (!membership) {
      throw new ForbiddenException();
    }

    request.group = {
      identifier: membership.groupIdentifier,
      role: membership.role,
    };

    return true;
  }
}
