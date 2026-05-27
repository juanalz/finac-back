import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Roles } from "src/auth/application/decorators/roles.decorator";
import { Role } from "src/auth/domain/role.enum";
import { CreateUserDto } from "../application/dto/create-user.dto";
import { UpdateUserDto } from "../application/dto/update-user.dto";
import { UserResponseDto } from "../application/dto/user-response.dto";
import { CreateUserUseCase } from "../application/services/create-user.use-case";
import { DeleteUserUseCase } from "../application/services/delete-user.use-case";
import { FindAllUsersUseCase } from "../application/services/find-all-users.use-case";
import { FindOneUserUseCase } from "../application/services/find-one-user.use-case";
import { UpdateUserUseCase } from "../application/services/update-user.use-case";

@ApiTags("users")
@ApiBearerAuth()
@Roles(Role.ADMIN)
@Controller("users")
export class UsersController {
  constructor(
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly findOneUserUseCase: FindOneUserUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "List users" })
  @ApiResponse({ status: 200, type: UserResponseDto, isArray: true })
  findAll(): Promise<UserResponseDto[]> {
    return this.findAllUsersUseCase.execute();
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get a user by ID" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, type: UserResponseDto })
  findOne(
    @Param("id", new ParseUUIDPipe()) id: string,
  ): Promise<UserResponseDto> {
    return this.findOneUserUseCase.execute(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a user" })
  @ApiResponse({ status: 201, type: UserResponseDto })
  create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.createUserUseCase.execute(dto);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Update a user" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, type: UserResponseDto })
  update(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.updateUserUseCase.execute(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a user" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 204 })
  remove(@Param("id", new ParseUUIDPipe()) id: string): Promise<void> {
    return this.deleteUserUseCase.execute(id);
  }
}
