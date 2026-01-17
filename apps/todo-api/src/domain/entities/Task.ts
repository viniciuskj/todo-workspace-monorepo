import { BaseEntity } from './BaseEntity';

export class Task extends BaseEntity {
  title: string;
  description: string;
  completed: boolean;
  createdBy: string;
  groupIdentifier: string;

  constructor(props: Partial<Task>) {
    super(props);
    this.title = props?.title || '';
    this.description = props?.description || '';
    this.completed = props?.completed || false;
    this.createdBy = props?.createdBy || '';
    this.groupIdentifier = props?.groupIdentifier || '';
  }

  validate() {
    if (!this.title) {
      throw new Error('Title is required');
    }
    if (!this.description) {
      throw new Error('Description is required');
    }
    if (!this.createdBy) {
      throw new Error('Created by is required');
    }
    if (!this.groupIdentifier) {
      throw new Error('Group identifier is required');
    }
  }
}
