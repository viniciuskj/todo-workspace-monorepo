import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { DomainTaskService } from '../../domain/services/DomainTaskService';
import {
  TaskRequest,
  taskRequestSchema,
  TaskResponse,
} from '@my-workspace/shared-dtos';
import { Response, Request } from 'express';
import { Task } from '../../domain/entities/Task';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: DomainTaskService) {}

  @Post()
  async createTask(
    @Body() taskRequest: TaskRequest,
    @Res() res: Response,
    @Req() req: Request
  ): Promise<Response<TaskResponse>> {
    const user = req.user;
    const group = req.group;

    const validatedTask = taskRequestSchema.parse(taskRequest);

    const newTask = new Task({
      title: validatedTask.title,
      description: validatedTask.description,
      completed: validatedTask.completed,
      groupIdentifier: group.identifier,
      createdBy: user.identifier,
    });

    const createdTask = await this.taskService.create(newTask);

    const taskResponse: TaskResponse = {
      identifier: createdTask.identifier,
      title: createdTask.title,
      description: createdTask.description,
      completed: createdTask.completed,
      groupIdentifier: createdTask.groupIdentifier,
      createdBy: createdTask.createdBy,
      createdAt: createdTask.createdAt,
      updatedAt: createdTask.updatedAt,
    };

    return res.status(201).json(taskResponse);
  }

  @Put(':identifier')
  async updateTask(
    @Body() taskRequest: TaskRequest,
    @Param('identifier') identifier: string,
    @Res() res: Response
  ): Promise<Response<TaskResponse>> {
    const validatedTaskRequest = taskRequestSchema.parse(taskRequest);

    const task = await this.taskService.readOne(identifier);

    task.title = validatedTaskRequest.title;
    task.description = validatedTaskRequest.description;
    task.completed = validatedTaskRequest.completed;

    const updatedTask = await this.taskService.update(task);

    const taskResponse: TaskResponse = {
      identifier: updatedTask.identifier,
      title: updatedTask.title,
      description: updatedTask.description,
      completed: updatedTask.completed,
      groupIdentifier: updatedTask.groupIdentifier,
      createdBy: updatedTask.createdBy,
      createdAt: updatedTask.createdAt,
      updatedAt: updatedTask.updatedAt,
    };

    return res.status(200).json(taskResponse);
  }

  @Get()
  async getTasks(
    @Res() res: Response,
    @Req() req: Request
  ): Promise<Response<TaskResponse[]>> {
    const userIdentifier = req.user?.identifier || '';
    const tasks = await this.taskService.readMany(userIdentifier);

    const taskResponses: TaskResponse[] = tasks.map((task) => ({
      identifier: task.identifier,
      title: task.title,
      description: task.description,
      completed: task.completed,
      groupIdentifier: task.groupIdentifier,
      createdBy: task.createdBy,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }));

    return res.status(200).json(taskResponses);
  }

  @Get(':identifier')
  async getTaskDetails(
    @Param('identifier') identifier: string,
    @Res() res: Response
  ): Promise<Response<TaskResponse>> {
    const task = await this.taskService.readOne(identifier);

    const taskResponse: TaskResponse = {
      identifier: task.identifier,
      title: task.title,
      description: task.description,
      completed: task.completed,
      groupIdentifier: task.groupIdentifier,
      createdBy: task.createdBy,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };

    return res.status(200).json(taskResponse);
  }

  @Delete(':identifier')
  async deleteTask(
    @Param('identifier') identifier: string,
    @Res() res: Response
  ): Promise<Response<void>> {
    await this.taskService.delete(identifier);

    return res.status(204).send();
  }
}
