import z from 'zod';

export const groupMemberRequestSchema = z.object({
  role: z.enum(['ADMIN', 'MEMBER', 'OWNER']),
  userIdentifier: z.string(),
  groupIdentifier: z.string(),
});

export interface GroupMemberRequest {
  role: string;
  userIdentifier: string;
  groupIdentifier: string;
}
