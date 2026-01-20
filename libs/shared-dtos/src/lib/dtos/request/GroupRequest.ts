import z from 'zod';

export const groupRequestSchema = z.object({
  name: z.string().min(2).max(100),
  isPersonal: z.boolean(),
});

export interface GroupRequest {
  name: string;
  isPersonal: boolean;
}
