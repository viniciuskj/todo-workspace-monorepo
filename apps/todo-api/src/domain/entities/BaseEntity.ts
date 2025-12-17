export class BaseEntity {
  identifier: string;
  createdAt: Date;
  updatedAt?: Date;

  constructor(props?: Partial<BaseEntity>) {
    Object.assign(this, props);
    this.identifier = props?.identifier || '';
    this.createdAt = props?.createdAt || new Date();
    this.updatedAt = props?.updatedAt;
  }
}
