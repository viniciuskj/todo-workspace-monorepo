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
    this.role = props.role || RoleType.MEMBER;
    this.joinedAt = props.joinedAt || new Date();
    this.userIdentifier = props.userIdentifier || ``;
    this.groupIdentifier = props.groupIdentifier || ``;
  }
}
