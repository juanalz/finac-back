import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Request } from "express";
import { Public } from "../application/decorators/public.decorator";
import { AuthResponseDto } from "../application/dto/auth-response.dto";
import { LoginDto } from "../application/dto/login.dto";
import { AuthService } from "../application/services/auth.service";
import { AuthenticatedUser } from "../domain/authenticated-user";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("login")
  @ApiOperation({ summary: "Login with local credentials" })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @Get("me")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get authenticated user" })
  me(@Req() request: Request & { user: AuthenticatedUser }): AuthenticatedUser {
    return request.user;
  }
}
