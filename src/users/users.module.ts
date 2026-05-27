import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { CreateUserUseCase } from "./application/services/create-user.use-case";
import { DeleteUserUseCase } from "./application/services/delete-user.use-case";
import { FindAllUsersUseCase } from "./application/services/find-all-users.use-case";
import { FindOneUserUseCase } from "./application/services/find-one-user.use-case";
import { PasswordHasherService } from "./application/services/password-hasher.service";
import { UpdateUserUseCase } from "./application/services/update-user.use-case";
import { UserPrismaRepository } from "./infrastructure/persistence/user.repository.prisma";
import { UsersController } from "./presentation/users.controller";

const useCases = [
  FindAllUsersUseCase,
  FindOneUserUseCase,
  CreateUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
];

@Module({
  controllers: [UsersController],
  imports: [PrismaModule],
  providers: [
    ...useCases,
    PasswordHasherService,
    {
      provide: "UserRepositoryInterface",
      useClass: UserPrismaRepository,
    },
  ],
  exports: [
    PasswordHasherService,
    {
      provide: "UserRepositoryInterface",
      useClass: UserPrismaRepository,
    },
  ],
})
export class UsersModule {}
