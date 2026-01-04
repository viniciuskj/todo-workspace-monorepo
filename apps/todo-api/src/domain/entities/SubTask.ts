import { BaseEntity } from './BaseEntity';

export class SubTask extends BaseEntity {
  title: string;
  description: string;
  completed: boolean;
  taskIdentifier: string;
  userIdentifier: string;

  constructor(props: Partial<SubTask>) {
    super(props);
    this.title = props.title || ``;
    this.description = props.description || ``;
    this.completed = props.completed || false;
    this.userIdentifier = props.userIdentifier || ``;
    this.taskIdentifier = props.taskIdentifier || ``;
  }

  validate() {
    if (!this.title) throw new Error(`Title is required`);
    if (!this.description) throw new Error(`Description is required`);
  }
}
