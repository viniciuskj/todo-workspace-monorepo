import z from 'zod';

export const loginRequestSchema = z.object({
  email: z.string().email().nonempty('Email is required'),
  password: z.string().nonempty('Password is required'),
});

export interface LoginRequest {
  email: string;
  password: string;
}
