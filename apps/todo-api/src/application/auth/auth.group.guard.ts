import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';
import { DomainGroupMemberRepository } from '../../domain/repositories/DomainGroupMemberRepository';
import { Request } from 'express';
import { DOMAIN_GROUPMEMBER_REPOSITORY } from '../../domain/repositories/tokens/tokens';

@Injectable()
export class GroupAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(DOMAIN_GROUPMEMBER_REPOSITORY)
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
      throw new UnauthorizedException('User is not a member of the group');
    }

    request.group = {
      identifier: membership.groupIdentifier,
      role: membership.role,
    };

    return true;
  }
}
