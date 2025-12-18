import { LoginRequest, LoginResponse } from '@my-workspace/shared-dtos';
import axiosInstance from './api-client';

export class AuthClient {
  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const response = await axiosInstance.post('/auth/login', loginRequest);
    return response.data;
  }
}

export const authClient = new AuthClient();
