import { Inject, Injectable } from "@nestjs/common";
import { UserRepositoryInterface } from "src/users/domain/repositories/user.repository-interface";
import { UserResponseDto } from "../dto/user-response.dto";

@Injectable()
export class FindAllUsersUseCase {
  constructor(
    @Inject("UserRepositoryInterface")
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findMany({
      conditions: { deletedAt: null },
    });
    return users.map((user) => UserResponseDto.fromEntity(user));
  }
}
