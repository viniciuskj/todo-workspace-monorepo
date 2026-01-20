export interface SubTaskResponse {
  identifier: string;
  title: string;
  description: string;
  createdBy: string;
  taskIdentifier: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
