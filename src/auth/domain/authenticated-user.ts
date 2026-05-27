import { Role } from "./role.enum";

export interface AuthenticatedUser {
  sub: string;
  username: string;
  role: Role;
}
