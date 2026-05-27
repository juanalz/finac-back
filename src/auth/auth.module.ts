import { Module } from "@nestjs/common";
import { UsersModule } from "src/users/users.module";
import { AuthService } from "./application/services/auth.service";
import { JwtTokenService } from "./application/services/jwt-token.service";
import { AuthController } from "./presentation/auth.controller";

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, JwtTokenService],
  exports: [JwtTokenService],
})
export class AuthModule {}
