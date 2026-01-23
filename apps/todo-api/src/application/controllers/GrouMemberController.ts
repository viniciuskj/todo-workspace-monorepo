import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Put,
  Res,
} from '@nestjs/common';
import { DomainGroupMemberService } from '../../domain/services/DomainGroupMemberService';
import {
  GroupMemberRequest,
  groupMemberRequestSchema,
  GroupMemberResponse,
} from '@my-workspace/shared-dtos';
import { GroupMember } from '../../domain/entities/GroupMember';
import { Response } from 'express';
import { getRoleTypeFromString } from '../../domain/types/RoleType';

@Controller('group-members')
export class GrouMemberController {
  constructor(private readonly groupMemberService: DomainGroupMemberService) {}

  async createGroupMember(
    @Body() groupMemberRequest: GroupMemberRequest,
    @Res() res: Response
  ): Promise<Response<GroupMemberResponse>> {
    const validatedGroupMemberRequest =
      groupMemberRequestSchema.parse(groupMemberRequest);

    const newGroupMember = new GroupMember({
      role: getRoleTypeFromString(validatedGroupMemberRequest.role),
      userIdentifier: validatedGroupMemberRequest.userIdentifier,
      groupIdentifier: validatedGroupMemberRequest.groupIdentifier,
    });

    const createdGroupMember = await this.groupMemberService.create(
      newGroupMember
    );

    const groupMemberResponse: GroupMemberResponse = {
      identifier: createdGroupMember.identifier,
      role: createdGroupMember.role,
      userIdentifier: createdGroupMember.userIdentifier,
      groupIdentifier: createdGroupMember.groupIdentifier,
    };

    return res.status(HttpStatus.CREATED).json(groupMemberResponse);
  }

  @Get('identifier')
  async getGroupDetails(
    @Param('identifier') identifier: string,
    @Res() res: Response
  ): Promise<Response<GroupMemberResponse>> {
    const groupMember = await this.groupMemberService.readOne(identifier);

    const groupMemberResponse: GroupMemberResponse = {
      identifier: groupMember.identifier,
      role: groupMember.role,
      userIdentifier: groupMember.userIdentifier,
      groupIdentifier: groupMember.groupIdentifier,
    };

    return res.status(HttpStatus.OK).json(groupMemberResponse);
  }

  @Put()
  async updateGroupMember(
    @Param('identifier') identifier: string,
    @Body() groupMemberRequest: GroupMemberRequest,
    @Res() res: Response
  ): Promise<Response<GroupMemberResponse>> {
    const validatedGroupMemberRequest =
      groupMemberRequestSchema.parse(groupMemberRequest);

    const currentGroupMember = await this.groupMemberService.readOne(
      identifier
    );

    currentGroupMember.role = getRoleTypeFromString(
      validatedGroupMemberRequest.role
    );
    currentGroupMember.userIdentifier =
      validatedGroupMemberRequest.userIdentifier;
    currentGroupMember.groupIdentifier =
      validatedGroupMemberRequest.groupIdentifier;

    const updatedGroupMember = await this.groupMemberService.update(
      currentGroupMember
    );

    const groupMemberResponse: GroupMemberResponse = {
      identifier: updatedGroupMember.identifier,
      role: updatedGroupMember.role,
      userIdentifier: updatedGroupMember.userIdentifier,
      groupIdentifier: updatedGroupMember.groupIdentifier,
    };

    return res.status(HttpStatus.OK).json(groupMemberResponse);
  }

  @Delete(':identifier')
  async deleteGroupMember(
    @Param('identifier') identifier: string,
    @Res() res: Response
  ): Promise<Response<void>> {
    await this.groupMemberService.delete(identifier);

    return res.status(HttpStatus.NO_CONTENT).send();
  }

  @Get('groups/:groupIdentifier')
  async getGroups(
    @Param('groupIdentifier') groupIdentifier: string,
    @Res() res: Response
  ): Promise<Response<GroupMemberResponse[]>> {
    const groupMembers = await this.groupMemberService.readMany(
      groupIdentifier
    );

    const groupMemberResponses: GroupMemberResponse[] = groupMembers.map(
      (member) => ({
        identifier: member.identifier,
        role: member.role,
        userIdentifier: member.userIdentifier,
        groupIdentifier: member.groupIdentifier,
      })
    );

    return res.status(HttpStatus.OK).json(groupMemberResponses);
  }
}
