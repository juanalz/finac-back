import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../../domain/role.enum";

export class AuthUserDto {
  @ApiProperty({ example: "admin" })
  username: string;

  @ApiProperty({ enum: Role, example: Role.ADMIN })
  role: Role;
}

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty({ example: "Bearer" })
  tokenType: "Bearer";

  @ApiProperty({ type: AuthUserDto })
  user: AuthUserDto;
}
