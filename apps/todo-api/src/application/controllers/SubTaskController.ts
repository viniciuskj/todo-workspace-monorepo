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
import { DomainSubTaskService } from '../../domain/services/DomainSubTaskService';
import {
  SubTaskRequest,
  subTaskRequestSchema,
  SubTaskResponse,
} from '@my-workspace/shared-dtos';
import { Request, Response } from 'express';
import { SubTask } from '../../domain/entities/SubTask';

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
      title: validatedSubTaskRequest.title,
      description: validatedSubTaskRequest.description,
      completed: validatedSubTaskRequest.completed,
      createdBy: user.identifier,
      taskIdentifier: validatedSubTaskRequest.taskIdentifier,
    });

    const createdSubTask = await this.subTaskService.create(newSubTask);

    const subTaskResponse: SubTaskResponse = {
      identifier: createdSubTask.identifier,
      title: createdSubTask.title,
      description: createdSubTask.description,
      createdBy: createdSubTask.createdBy,
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
      createdBy: subTask.createdBy,
      taskIdentifier: subTask.taskIdentifier,
      completed: subTask.completed,
      createdAt: subTask.createdAt,
      updatedAt: subTask.updatedAt,
    };

    return res.status(HttpStatus.OK).json(subTaskResponse);
  }

  @Get('task/:taskIdentifier')
  async getSubTasks(
    @Param('taskIdentifier') taskIdentifier: string,
    @Res() res: Response
  ): Promise<Response<SubTaskResponse>> {
    const subTasks = await this.subTaskService.readMany(taskIdentifier);

    const subTaskResponses: SubTaskResponse[] = subTasks.map((subTask) => ({
      identifier: subTask.identifier,
      title: subTask.title,
      description: subTask.description,
      createdBy: subTask.createdBy,
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
      createdBy: subTask.createdBy,
      taskIdentifier: updatedSubTask.taskIdentifier,
      completed: updatedSubTask.completed,
      createdAt: updatedSubTask.createdAt,
      updatedAt: updatedSubTask.updatedAt,
    };

    return res.status(HttpStatus.OK).json(subTaskResponse);
  }

  @Delete(':identifier')
  async deleteSubTask(
    @Param('identifier') identifier: string,
    @Res() res: Response
  ): Promise<Response<void>> {
    await this.subTaskService.delete(identifier);

    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
