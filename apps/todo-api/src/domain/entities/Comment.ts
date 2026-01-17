import { BaseEntity } from './BaseEntity';

export class Comment extends BaseEntity {
  author: string;
  content: string;
  taskIdentifier: string;

  constructor(props: Partial<Comment>) {
    super(props);
    this.author = props.author || ``;
    this.content = props.content || ``;
    this.taskIdentifier = props.taskIdentifier || ``;
  }

  validate() {
    if (!this.content) {
      throw new Error('Content is required');
    }
  }
}
