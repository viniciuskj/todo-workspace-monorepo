import { v4 as uuid } from 'uuid';

export class BaseEntity {
  identifier: string;
  createdAt: Date;
  updatedAt?: Date;

  constructor(props?: Partial<BaseEntity>) {
    Object.assign(this, props);
    this.identifier = props?.identifier || uuid();
    this.createdAt = props?.createdAt || new Date();
    this.updatedAt = props?.updatedAt;
  }
}
