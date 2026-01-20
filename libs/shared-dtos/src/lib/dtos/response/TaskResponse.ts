export interface TaskResponse {
  identifier: string;
  title: string;
  description: string;
  completed: boolean;
  groupIdentifier: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
