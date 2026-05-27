import { Inject, Injectable } from "@nestjs/common";
import { Prisma } from "src/prisma/prisma-client/client";
import { PrismaService } from "src/prisma/prisma.service";
import { User, UserProps } from "src/users/domain/entities/user.entity";
import { UserRepositoryInterface } from "src/users/domain/repositories/user.repository-interface";

@Injectable()
export class UserPrismaRepository implements UserRepositoryInterface {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async findMany({
    conditions,
  }: {
    conditions: Prisma.UserWhereInput;
  }): Promise<User[]> {
    const records = await this.prisma.user.findMany({
      where: conditions,
      orderBy: { createdAt: "desc" },
    });

    return records.map((record) => User.fromPrisma(record as UserProps));
  }

  async findUnique({
    conditions,
  }: {
    conditions: Prisma.UserWhereInput;
  }): Promise<User | null> {
    const record = await this.prisma.user.findFirst({ where: conditions });

    if (!record) return null;

    return User.fromPrisma(record as UserProps);
  }

  async create(user: UserProps): Promise<User> {
    const record = await this.prisma.user.create({
      data: user as Prisma.UserCreateInput,
    });

    return User.fromPrisma(record as UserProps);
  }

  async update(id: string, user: Partial<UserProps>): Promise<User> {
    const record = await this.prisma.user.update({
      where: { id },
      data: user as Prisma.UserUpdateInput,
    });

    return User.fromPrisma(record as UserProps);
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.user.delete({ where: { id } });

    return true;
  }
}
