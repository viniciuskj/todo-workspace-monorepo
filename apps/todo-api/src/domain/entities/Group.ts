import { BaseEntity } from './BaseEntity';

export class Group extends BaseEntity {
  name: string;
  isPersonal: boolean;
  createdBy: string;

  constructor(props: Partial<Group>) {
    super(props);
    this.name = props.name || '';
    this.isPersonal = props.isPersonal || false;
    this.createdBy = props.createdBy || '';
  }

  validate() {
    if (!this.name) {
      throw new Error('Group name is required');
    }

    if (!this.createdBy) {
      throw new Error('Group creator is required');
    }
  }
}
