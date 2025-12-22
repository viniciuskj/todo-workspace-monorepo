import axiosInstance from './api-client';
import { TaskRequest, TaskResponse } from '@my-workspace/shared-dtos';

export class TaskClient {
  private basePath = '/tasks';

  async createTask(taskRequest: TaskRequest): Promise<TaskResponse> {
    const response = await axiosInstance.post<TaskResponse>(
      this.basePath,
      taskRequest
    );
    return response.data;
  }

  async getTask(identifier: string): Promise<TaskResponse> {
    const response = await axiosInstance.get<TaskResponse>(
      `${this.basePath}/${identifier}`
    );
    return response.data;
  }

  async updateTask(
    identifier: string,
    taskRequest: TaskRequest
  ): Promise<TaskResponse> {
    const response = await axiosInstance.put<TaskResponse>(
      `${this.basePath}/${identifier}`,
      taskRequest
    );
    return response.data;
  }

  async getTasks(): Promise<TaskResponse[]> {
    const response = await axiosInstance.get<TaskResponse[]>(this.basePath);
    return response.data;
  }

  async delete(identifier: string): Promise<void> {
    await axiosInstance.delete(`${this.basePath}/${identifier}`);
  }
}

export const taskClient = new TaskClient();
