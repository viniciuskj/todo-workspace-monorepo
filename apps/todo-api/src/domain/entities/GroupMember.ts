import { RoleType } from '../types/RoleType';
import { v4 as uuid } from 'uuid';

export class GroupMember {
  identifier: string;
  role: RoleType;
  joinedAt: Date;
  userIdentifier: string;
  groupIdentifier: string;

  constructor(props: Partial<GroupMember>) {
    this.identifier = props.identifier || uuid();
    this.role = props.role || RoleType.OWNER;
    this.joinedAt = props.joinedAt || new Date();
    this.userIdentifier = props.userIdentifier || '';
    this.groupIdentifier = props.groupIdentifier || '';
  }

  validate() {
    if (!this.role) {
      throw new Error('GroupMember role is required');
    }
    if (!this.userIdentifier) {
      throw new Error('GroupMember userIdentifier is required');
    }
    if (!this.groupIdentifier) {
      throw new Error('GroupMember groupIdentifier is required');
    }
  }
}
