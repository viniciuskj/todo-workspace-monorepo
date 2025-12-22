import z from 'zod';

export const taskRequestSchema = z.object({
  title: z.string().min(2).nonempty('Title is required'),
  description: z.string().nonempty('Description is required'),
  completed: z.boolean().default(false),
});

export interface TaskRequest {
  title: string;
  description: string;
  completed: boolean;
}
