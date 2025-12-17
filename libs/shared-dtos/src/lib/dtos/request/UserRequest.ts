import z from 'zod';

export const userRequestSchema = z.object({
  name: z.string().min(1).nonempty('Name is required'),
  email: z.string().email('Invalid email').nonempty('Email is required'),
  password: z.string().min(3).nonempty('Password is required'),
});

export interface UserRequest {
  name: string;
  email: string;
  password: string;
}
