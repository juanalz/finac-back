import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Req,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { FindAllTransactionsUseCase } from "../application/services/find-all-transactions.use-case";
import { FindOneTransactionUseCase } from "../application/services/find-one-transaction.use-case";
import { CreateTransactionUseCase } from "../application/services/create-transaction.use-case";
import { UpdateTransactionUseCase } from "../application/services/update-transaction.use-case";
import { DeleteTransactionUseCase } from "../application/services/delete-transaction.use-case";
import { TransactionResponseDto } from "../application/dto/transaction-response.dto";
import { CreateTransactionDto } from "../application/dto/create-transaction.dto";
import { UpdateTransactionDto } from "../application/dto/update-transaction.dto";
import { QueryTransactionDto } from "../application/dto/query-transaction.dto";
import { PaginatedTransactions } from "../domain/repositories/transaction.repository-interface";
import { CreateTransactionsDto } from "../application/dto/create-transactions.dto";
import { Request } from "express";
import { AuthenticatedUser } from "src/auth/domain/authenticated-user";

@ApiTags("transactions")
@Controller("transactions")
export class TransactionsController {
  constructor(
    private readonly findAllTransactionsUseCase: FindAllTransactionsUseCase,
    private readonly findOneTransactionUseCase: FindOneTransactionUseCase,
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly updateTransactionUseCase: UpdateTransactionUseCase,
    private readonly deleteTransactionUseCase: DeleteTransactionUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Listar transacciones",
    description:
      "Soporta filtros por tipo, categoría, rango de fechas y paginación.",
  })
  @ApiResponse({ status: 200, description: "Lista paginada de transacciones" })
  findAll(@Query() query: QueryTransactionDto): Promise<PaginatedTransactions> {
    return this.findAllTransactionsUseCase.execute(query);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Obtener una transacción por ID" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, type: TransactionResponseDto })
  @ApiResponse({ status: 404, description: "No encontrado" })
  findOne(
    @Param("id", new ParseUUIDPipe()) id: string,
  ): Promise<TransactionResponseDto> {
    return this.findOneTransactionUseCase.execute(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Crear una transacción" })
  @ApiResponse({ status: 201, type: TransactionResponseDto, isArray: true })
  create(
    @Body() createTransactions: CreateTransactionsDto,
    @Req() request: Request & { user: AuthenticatedUser },
  ): Promise<TransactionResponseDto[]> {
    const { items } = createTransactions;
    return this.createTransactionUseCase.execute(
      items.map((item) => ({ ...item, userId: request.user.sub })),
    );
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Actualizar parcialmente una transacción" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, description: "No encontrado" })
  update(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTransactionDto,
  ): Promise<boolean> {
    return this.updateTransactionUseCase.execute(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Eliminar una transacción" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404, description: "No encontrado" })
  remove(@Param("id", new ParseUUIDPipe()) id: string): Promise<void> {
    return this.deleteTransactionUseCase.execute(id);
  }
}
