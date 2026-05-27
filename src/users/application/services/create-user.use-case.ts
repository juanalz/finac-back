import { Inject, Injectable } from "@nestjs/common";
import { DomainException } from "src/modules/pino/domain/exceptions/domain.exception";
import { UserRepositoryInterface } from "src/users/domain/repositories/user.repository-interface";
import { CreateUserDto } from "../dto/create-user.dto";
import { UserResponseDto } from "../dto/user-response.dto";
import { PasswordHasherService } from "./password-hasher.service";

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject("UserRepositoryInterface")
    private readonly userRepository: UserRepositoryInterface,
    private readonly passwordHasher: PasswordHasherService,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    const exists = await this.userRepository.findUnique({
      conditions: { username: dto.username, deletedAt: null },
    });

    if (exists)
      throw new DomainException(`Username ${dto.username} already exists`);

    const user = await this.userRepository.create({
      username: dto.username,
      passwordHash: this.passwordHasher.hash(dto.password),
      role: dto.role,
    });

    return UserResponseDto.fromEntity(user);
  }
}
