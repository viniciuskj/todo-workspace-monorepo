import axiosInstance from './api-client';
import { UserRequest, UserResponse } from '@my-workspace/shared-dtos';

export class UserClient {
  private basePath = '/users';

  async createUser(userRequest: UserRequest): Promise<UserResponse> {
    const response = await axiosInstance.post<UserResponse>(
      this.basePath,
      userRequest
    );
    return response.data;
  }

  async getUser(identifier: string): Promise<UserResponse> {
    const response = await axiosInstance.get<UserResponse>(
      `${this.basePath}/${identifier}`
    );
    return response.data;
  }

  async updateUser(
    identifier: string,
    userRequest: UserRequest
  ): Promise<UserResponse> {
    const response = await axiosInstance.put<UserResponse>(
      `${this.basePath}/${identifier}`,
      userRequest
    );
    return response.data;
  }

  async getUsers(): Promise<UserResponse[]> {
    const response = await axiosInstance.get<UserResponse[]>(
      `${this.basePath}`
    );
    return response.data;
  }
}

export const userClient = new UserClient();
