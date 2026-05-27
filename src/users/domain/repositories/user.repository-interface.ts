import { User, UserProps } from "../entities/user.entity";

export interface UserRepositoryInterface {
  findMany({ conditions }: { conditions: any }): Promise<User[]>;
  findUnique({ conditions }: { conditions: any }): Promise<User | null>;
  create(user: UserProps): Promise<User>;
  update(id: string, user: Partial<UserProps>): Promise<User>;
  delete(id: string): Promise<boolean>;
}
