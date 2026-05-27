import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PasswordHasherService } from "src/users/application/services/password-hasher.service";
import { User } from "src/users/domain/entities/user.entity";
import { UserRepositoryInterface } from "src/users/domain/repositories/user.repository-interface";
import { AuthResponseDto } from "../dto/auth-response.dto";
import { LoginDto } from "../dto/login.dto";
import { JwtTokenService } from "./jwt-token.service";
import { AuthenticatedUser } from "../../domain/authenticated-user";

@Injectable()
export class AuthService {
  constructor(
    @Inject("UserRepositoryInterface")
    private readonly userRepository: UserRepositoryInterface,
    private readonly passwordHasher: PasswordHasherService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findUnique({
      conditions: { username: dto.username, deletedAt: null },
    });

    if (!user || !this.passwordHasher.verify(dto.password, user.passwordHash)) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const authUser = this.toAuthUser(user);

    return {
      accessToken: this.jwtTokenService.sign(authUser),
      tokenType: "Bearer",
      user: authUser,
    };
  }

  private toAuthUser(user: User): AuthenticatedUser {
    return {
      sub: user.id ?? "",
      username: user.username,
      role: user.role,
    };
  }
}
