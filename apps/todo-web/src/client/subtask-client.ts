import axiosInstance from './api-client';
import { SubTaskRequest, SubTaskResponse } from '@my-workspace/shared-dtos';

export class SubTaskClient {
  private basePath = '/subtasks';

  async createSubTask(
    subTaskRequest: SubTaskRequest
  ): Promise<SubTaskResponse> {
    const response = await axiosInstance.post<SubTaskResponse>(
      this.basePath,
      subTaskRequest
    );
    return response.data;
  }

  async getSubTask(identifier: string): Promise<SubTaskResponse> {
    const response = await axiosInstance.get<SubTaskResponse>(
      `${this.basePath}/${identifier}`
    );
    return response.data;
  }

  async updateSubTask(
    identifier: string,
    subTaskRequest: SubTaskRequest
  ): Promise<SubTaskResponse> {
    const response = await axiosInstance.put<SubTaskResponse>(
      `${this.basePath}/${identifier}`,
      subTaskRequest
    );
    return response.data;
  }

  async getSubTasks(taskIdentifier: string): Promise<SubTaskResponse[]> {
    const response = await axiosInstance.get<SubTaskResponse[]>(
      `${this.basePath}/task/${taskIdentifier}`
    );
    return response.data;
  }

  async delete(identifier: string): Promise<void> {
    await axiosInstance.delete(`${this.basePath}/${identifier}`);
  }
}

export const subTaskClient = new SubTaskClient();
