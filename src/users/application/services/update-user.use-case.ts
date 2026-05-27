import { Inject, Injectable } from "@nestjs/common";
import { DomainException } from "src/modules/pino/domain/exceptions/domain.exception";
import { UserProps } from "src/users/domain/entities/user.entity";
import { UserRepositoryInterface } from "src/users/domain/repositories/user.repository-interface";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UserResponseDto } from "../dto/user-response.dto";
import { PasswordHasherService } from "./password-hasher.service";

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject("UserRepositoryInterface")
    private readonly userRepository: UserRepositoryInterface,
    private readonly passwordHasher: PasswordHasherService,
  ) {}

  async execute(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const exists = await this.userRepository.findUnique({
      conditions: { id, deletedAt: null },
    });

    if (!exists) throw new DomainException(`User #${id} not found`);

    if (dto.username && dto.username !== exists.username) {
      const duplicate = await this.userRepository.findUnique({
        conditions: { username: dto.username, deletedAt: null },
      });
      if (duplicate)
        throw new DomainException(`Username ${dto.username} already exists`);
    }

    const data: Partial<UserProps> = {
      username: dto.username,
      role: dto.role,
      ...(dto.password
        ? { passwordHash: this.passwordHasher.hash(dto.password) }
        : {}),
    };

    const user = await this.userRepository.update(id, data);
    return UserResponseDto.fromEntity(user);
  }
}
