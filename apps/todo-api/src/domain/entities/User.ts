import { BaseEntity } from './BaseEntity';

export class User extends BaseEntity {
  name: string;
  email: string;
  password: string;

  constructor(props: Partial<User>) {
    super(props);
    this.name = props?.name || '';
    this.email = props?.email || '';
    this.password = props?.password || '';
  }

  validate() {
    if (!this.name) {
      throw new Error('Name is required');
    }
    if (!this.email) {
      throw new Error('Email is required');
    }
    if (!this.password) {
      throw new Error('Password is required');
    }
  }
}
