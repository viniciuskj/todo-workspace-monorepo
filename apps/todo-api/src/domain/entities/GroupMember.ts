import { RoleType } from '../types/RoleType';
import { BaseEntity } from './BaseEntity';

export class GroupMember extends BaseEntity {
  role: RoleType;
  joinedAt: Date;
  useridentifier: string;
  groupIdentifier: string;

  constructor(props: Partial<GroupMember>) {
    super(props);
    this.role = props.role || RoleType.MEMBER;
    this.joinedAt = props.joinedAt || new Date();
    this.useridentifier = props.useridentifier || ``;
    this.groupIdentifier = props.groupIdentifier || ``;
  }
}
