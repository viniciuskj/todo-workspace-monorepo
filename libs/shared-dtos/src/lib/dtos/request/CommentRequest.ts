import z from 'zod';

export const commentRequestSchema = z.object({
  content: z.string().min(1).max(255),
  userIdentifier: z.string(),
  taskIdentifier: z.string(),
});

export interface CommentRequest {
  content: string;
  userIdentifier: string;
  taskIdentifier: string;
}
