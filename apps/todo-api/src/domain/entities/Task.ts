import { BaseEntity } from './BaseEntity';

export class Task extends BaseEntity {
  title: string;
  description: string;
  completed: boolean;
  userIdentifier: string;

  constructor(props: Partial<Task>) {
    super(props);
    this.title = props?.title || '';
    this.description = props?.description || '';
    this.completed = props?.completed || false;
    this.userIdentifier = props?.userIdentifier || '';
  }

  validate() {
    if (!this.title) {
      throw new Error('Title is required');
    }
    if (!this.description) {
      throw new Error('Description is required');
    }
  }
}
