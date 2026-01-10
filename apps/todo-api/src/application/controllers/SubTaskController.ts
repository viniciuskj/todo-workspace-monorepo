import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { DomainSubTaskService } from '../../domain/services/DomainSubTaskService';
import {
  SubTaskRequest,
  subTaskRequestSchema,
  SubTaskResponse,
} from '@my-workspace/shared-dtos';
import { Request, Response } from 'express';
import { SubTask } from '../../domain/entities/SubTask';
import { v4 as uuid } from 'uuid';

@Controller('subtasks')
export class SubTaskController {
  constructor(private readonly subTaskService: DomainSubTaskService) {}

  @Post()
  async createSubTask(
    @Body() subTaskRequest: SubTaskRequest,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<Response<SubTaskResponse>> {
    const user = req.user;

    const validatedSubTaskRequest = subTaskRequestSchema.parse(subTaskRequest);

    const newSubTask = new SubTask({
      identifier: uuid(),
      title: validatedSubTaskRequest.title,
      description: validatedSubTaskRequest.description,
      completed: validatedSubTaskRequest.completed,
      userIdentifier: user.identifier,
      taskIdentifier: validatedSubTaskRequest.taskIdentifier,
    });

    const createdSubTask = await this.subTaskService.create(newSubTask);

    const subTaskResponse: SubTaskResponse = {
      identifier: createdSubTask.identifier,
      title: createdSubTask.title,
      description: createdSubTask.description,
      taskIdentifier: createdSubTask.taskIdentifier,
      completed: createdSubTask.completed,
      createdAt: createdSubTask.createdAt,
      updatedAt: createdSubTask.updatedAt,
    };

    return res.status(HttpStatus.CREATED).json(subTaskResponse);
  }

  @Get(':identifier')
  async getSubTaskDetails(
    @Res() res: Response,
    @Param('identifier') identifier: string
  ): Promise<Response<SubTaskResponse>> {
    const subTask = await this.subTaskService.readOne(identifier);

    const subTaskResponse: SubTaskResponse = {
      identifier: subTask.identifier,
      title: subTask.title,
      description: subTask.description,
      taskIdentifier: subTask.taskIdentifier,
      completed: subTask.completed,
      createdAt: subTask.createdAt,
      updatedAt: subTask.updatedAt,
    };

    return res.status(HttpStatus.OK).json(subTaskResponse);
  }

  @Get()
  async getSubTasks(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<Response<SubTaskResponse>> {
    const user = req.user;

    const subTasks = await this.subTaskService.readMany(user.identifier);

    const subTaskResponses: SubTaskResponse[] = subTasks.map((subTask) => ({
      identifier: subTask.identifier,
      title: subTask.title,
      description: subTask.description,
      taskIdentifier: subTask.taskIdentifier,
      completed: subTask.completed,
      createdAt: subTask.createdAt,
      updatedAt: subTask.updatedAt,
    }));

    return res.status(HttpStatus.OK).json(subTaskResponses);
  }

  @Put(':identifier')
  async updateSubTask(
    @Res() res: Response,
    @Param('identifier') identifier: string,
    @Body() subTaskRequest: SubTaskRequest
  ): Promise<Response<SubTaskResponse>> {
    const validatedSubTaskRequest = subTaskRequestSchema.parse(subTaskRequest);

    const subTask = await this.subTaskService.readOne(identifier);

    subTask.title = validatedSubTaskRequest.title;
    subTask.description = validatedSubTaskRequest.description;
    subTask.completed = validatedSubTaskRequest.completed;

    const updatedSubTask = await this.subTaskService.update(subTask);

    const subTaskResponse: SubTaskResponse = {
      identifier: updatedSubTask.identifier,
      title: updatedSubTask.title,
      description: updatedSubTask.description,
      taskIdentifier: updatedSubTask.taskIdentifier,
      completed: updatedSubTask.completed,
      createdAt: updatedSubTask.createdAt,
      updatedAt: updatedSubTask.updatedAt,
    };

    return res.status(HttpStatus.OK).json(subTaskResponse);
  }
}
