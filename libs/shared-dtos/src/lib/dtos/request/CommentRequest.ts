import z from 'zod';

export const commentRequestSchema = z.object({
  content: z.string().min(1).max(255),
  taskIdentifier: z.string(),
});

export interface CommentRequest {
  content: string;
  taskIdentifier: string;
}
