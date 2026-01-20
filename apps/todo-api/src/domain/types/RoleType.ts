export enum RoleType {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export function getRoleTypeFromString(raw: string): RoleType | undefined {
  return Object.values(RoleType).find((type) => type === raw);
}
