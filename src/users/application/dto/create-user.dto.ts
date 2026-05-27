import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Role } from "src/auth/domain/role.enum";

export class CreateUserDto {
  @ApiProperty({ example: "juan" })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: "MyS3cret123" })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: Role, example: Role.USER })
  @IsEnum(Role)
  role: Role;
}
