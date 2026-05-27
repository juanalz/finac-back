import { Role } from "src/auth/domain/role.enum";

export interface UserProps {
  id?: string;
  username: string;
  passwordHash: string;
  role: Role;
}

export class User {
  public readonly id?: string;
  public readonly username: string;
  public readonly passwordHash: string;
  public readonly role: Role;

  constructor(props: UserProps) {
    this.id = props.id;
    this.username = props.username;
    this.passwordHash = props.passwordHash;
    this.role = props.role;
  }

  static fromPrisma(data: UserProps): User {
    return new User(data);
  }
}
