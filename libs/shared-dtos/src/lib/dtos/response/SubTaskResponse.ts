export interface SubTaskResponse {
  identifier: string;
  title: string;
  description: string;
  taskIdentifier: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
