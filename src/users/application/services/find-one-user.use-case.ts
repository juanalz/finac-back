import { Inject, Injectable } from "@nestjs/common";
import { DomainException } from "src/modules/pino/domain/exceptions/domain.exception";
import { UserRepositoryInterface } from "src/users/domain/repositories/user.repository-interface";
import { UserResponseDto } from "../dto/user-response.dto";

@Injectable()
export class FindOneUserUseCase {
  constructor(
    @Inject("UserRepositoryInterface")
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findUnique({
      conditions: { id, deletedAt: null },
    });

    if (!user) throw new DomainException(`User #${id} not found`);

    return UserResponseDto.fromEntity(user);
  }
}
