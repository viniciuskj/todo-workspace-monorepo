export interface Repository<T> {
  create(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(identifier: string): Promise<void>;
}
