import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { DomainGroupService } from '../../domain/services/DomainGroupService';
import {
  GroupRequest,
  groupRequestSchema,
  GroupResponse,
} from '@my-workspace/shared-dtos';
import { Response, Request } from 'express';
import { Group } from '../../domain/entities/Group';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: DomainGroupService) {}

  @Post()
  async createGroup(
    @Body() groupRequest: GroupRequest,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<Response<GroupResponse>> {
    const user = req.user;

    const validatedGroupRequest = groupRequestSchema.parse(groupRequest);

    const newGroup = new Group({
      name: validatedGroupRequest.name,
      isPersonal: validatedGroupRequest.isPersonal,
      createdBy: user.identifier,
    });

    const createdGroup = await this.groupService.create(newGroup);

    const groupResponse: GroupResponse = {
      identifier: createdGroup.identifier,
      name: createdGroup.name,
      isPersonal: createdGroup.isPersonal,
      createdBy: createdGroup.createdBy,
    };

    return res.status(HttpStatus.CREATED).json(groupResponse);
  }

  @Get('identifier')
  async getGroupDetails(
    @Param('identifier') identifier: string,
    @Res() res: Response
  ): Promise<Response<GroupResponse>> {
    const group = await this.groupService.readOne(identifier);

    const groupResponse: GroupResponse = {
      identifier: group.identifier,
      name: group.name,
      isPersonal: group.isPersonal,
      createdBy: group.createdBy,
    };

    return res.status(HttpStatus.OK).json(groupResponse);
  }

  @Put('identifier')
  async updateGroup(
    @Param('identifier') identifier: string,
    @Body() groupRequest: GroupRequest,
    @Res() res: Response
  ): Promise<Response<GroupResponse>> {
    const validatedGroupRequest = groupRequestSchema.parse(groupRequest);

    const group = await this.groupService.readOne(identifier);

    group.name = validatedGroupRequest.name;
    group.isPersonal = validatedGroupRequest.isPersonal;

    const updatedGroup = await this.groupService.update(group);

    const groupResponse: GroupResponse = {
      identifier: updatedGroup.identifier,
      name: updatedGroup.name,
      isPersonal: updatedGroup.isPersonal,
      createdBy: updatedGroup.createdBy,
    };

    return res.status(HttpStatus.OK).json(groupResponse);
  }

  @Get()
  async getGroups(@Res() res: Response): Promise<Response<GroupResponse[]>> {
    const groups = await this.groupService.readMany();

    const groupResponses: GroupResponse[] = groups.map((group) => ({
      identifier: group.identifier,
      name: group.name,
      isPersonal: group.isPersonal,
      createdBy: group.createdBy,
    }));

    return res.status(HttpStatus.OK).json(groupResponses);
  }

  @Delete(':identifier')
  async deleteGroup(
    @Param('identifier') identifier: string,
    @Res() res: Response
  ): Promise<Response<void>> {
    await this.groupService.delete(identifier);

    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
