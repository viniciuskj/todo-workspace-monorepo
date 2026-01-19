import { RoleType } from '../types/RoleType';

export class GroupMember {
  identifier: string;
  role: RoleType;
  joinedAt: Date;
  userIdentifier: string;
  groupIdentifier: string;

  constructor(props: Partial<GroupMember>) {
    this.role = props.role || RoleType.MEMBER;
    this.joinedAt = props.joinedAt || new Date();
    this.userIdentifier = props.userIdentifier || ``;
    this.groupIdentifier = props.groupIdentifier || ``;
  }
}
