import { BaseEntity } from './BaseEntity';

export class Comment extends BaseEntity {
  authorIdentifier: string;
  content: string;
  taskIdentifier: string;

  constructor(props: Partial<Comment>) {
    super(props);
    this.authorIdentifier = props.authorIdentifier;
    this.content = props.content;
    this.taskIdentifier = props.taskIdentifier;
  }

  validate() {
    if (!this.content) {
      throw new Error('Content is required');
    }
  }
}
