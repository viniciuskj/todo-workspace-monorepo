import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
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
    });

    const subTaskResponse: SubTaskResponse = {
      identifier: newSubTask.identifier,
      title: newSubTask.title,
      description: newSubTask.description,
      completed: newSubTask.completed,
      createdAt: newSubTask.createdAt,
      updatedAt: newSubTask.updatedAt,
    };

    return res.status(HttpStatus.CREATED).json(subTaskResponse);
  }
}
