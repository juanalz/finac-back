import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/auth/domain/role.enum";
import { User } from "../../domain/entities/user.entity";

export class UserResponseDto {
  @ApiProperty({ example: "fb160441-660f-4e4d-af0b-b65d1a368b6f" })
  id: string;

  @ApiProperty({ example: "juan" })
  username: string;

  @ApiProperty({ enum: Role, example: Role.USER })
  role: Role;

  constructor(user: User) {
    this.id = user.id ?? "";
    this.username = user.username;
    this.role = user.role;
  }

  static fromEntity(user: User): UserResponseDto {
    return new UserResponseDto(user);
  }
}
