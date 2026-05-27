import { Inject, Injectable } from "@nestjs/common";
import { DomainException } from "src/modules/pino/domain/exceptions/domain.exception";
import { UserRepositoryInterface } from "src/users/domain/repositories/user.repository-interface";

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject("UserRepositoryInterface")
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(id: string): Promise<void> {
    const exists = await this.userRepository.findUnique({
      conditions: { id, deletedAt: null },
    });

    if (!exists) throw new DomainException(`User #${id} not found`);

    await this.userRepository.delete(id);
  }
}
