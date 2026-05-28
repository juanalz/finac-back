import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Put,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiQuery,
} from "@nestjs/swagger";
import { FindAllPayCyclesUseCase } from "../application/services/find-all-pay-cycles.use-case";
import { FindOnePayCycleUseCase } from "../application/services/find-one-pay-cycle.use-case";
import { CreatePayCycleUseCase } from "../application/services/create-pay-cycle.use-case";
import { UpdatePayCycleUseCase } from "../application/services/update-pay-cycle.use-case";
import { DeletePayCycleUseCase } from "../application/services/delete-pay-cycle.use-case";
import { PayCycleResponseDto } from "../application/dto/pay-cycle-response.dto";
import { CreatePayCycleDto } from "../application/dto/create-pay-cycle.dto";
import { UpdatePayCycleDto } from "../application/dto/update-pay-cycle.dto";
import { ResolutionPayCycleUseCase } from "../application/services/resolution-pay-cycle.use.case";
import { SummaryPayCycleUseCase } from "../application/services/summary-pay-cycle-use-case";
import { CycleSummary } from "../application/helpers/pay-cycles.helpers";
import { Roles } from "src/auth/application/decorators/roles.decorator";
import { Role } from "src/auth/domain/role.enum";
import { Request } from "express";
import { AuthenticatedUser } from "src/auth/domain/authenticated-user";
import { S } from "node_modules/@faker-js/faker/dist/airline-eVQV6kbz";

@ApiTags("pay-cycles")
@Controller("pay-cycles")
export class PayCyclesController {
  constructor(
    private readonly findAllPayCyclesUseCase: FindAllPayCyclesUseCase,
    private readonly findOnePayCycleUseCase: FindOnePayCycleUseCase,
    private readonly createPayCycleUseCase: CreatePayCycleUseCase,
    private readonly updatePayCycleUseCase: UpdatePayCycleUseCase,
    private readonly deletePayCycleUseCase: DeletePayCycleUseCase,
    private readonly resolutionPayCycleUseCase: ResolutionPayCycleUseCase,
    private readonly summaryPayCycleUseCase: SummaryPayCycleUseCase,
  ) {}

  // ── Configuration ──────────────────────────────────────────────────────────

  @Get("config")
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get the active pay-cycle configuration" })
  @ApiResponse({ status: 200, type: PayCycleResponseDto })
  findAll(): Promise<PayCycleResponseDto> {
    return this.findOnePayCycleUseCase.execute();
  }

  @Get("saved")
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get saved pay-cycle records" })
  @ApiResponse({ status: 200, type: PayCycleResponseDto, isArray: true })
  findSaved(
    @Query("userId") userId: string,
  ): Promise<PayCycleResponseDto[]> {
    return this.findAllPayCyclesUseCase.execute(userId);
  }

  //   @Get(':id')
  //   @HttpCode(HttpStatus.OK)
  //   @ApiOperation({ summary: 'Get a pay-cycle by ID' })
  //   @ApiParam({ name: 'id', type: String })
  //   @ApiResponse({ status: 200, type: PayCycleResponseDto })
  //   @ApiResponse({ status: 404, description: 'Pay-cycle not found' })
  //   findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<PayCycleResponseDto> {
  //     return this.findOnePayCycleUseCase.execute(id);
  //   }

  //   @Post()
  //   @HttpCode(HttpStatus.CREATED)
  //   @ApiOperation({ summary: 'Create a pay-cycle' })
  //   @ApiResponse({ status: 201, type: PayCycleResponseDto })
  //   create(@Body() dto: CreatePayCycleDto): Promise<PayCycleResponseDto> {
  //     return this.createPayCycleUseCase.execute(dto);
  //   }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Update a pay-cycle record" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, type: PayCycleResponseDto })
  @ApiResponse({ status: 404, description: "Ciclo de pago no encontrado" })
  updateOne(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() dto: UpdatePayCycleDto,
  ): Promise<PayCycleResponseDto> {
    return this.updatePayCycleUseCase.execute(id, dto);
  }

  @Put("config")
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Create or replace the pay-cycle configuration" })
  @ApiResponse({ status: 200, type: PayCycleResponseDto })
  @ApiResponse({ status: 404, description: "Pay-cycle not found" })
  update(
    @Body() dto: CreatePayCycleDto,
    @Req() request: Request & { user: AuthenticatedUser },
  ): Promise<PayCycleResponseDto> {
    return this.createPayCycleUseCase.execute({
      ...dto,
      userId: request.user.sub,
    });
  }

  @Delete(":id")
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a pay-cycle" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404, description: "Pay-cycle not found" })
  remove(@Param("id", new ParseUUIDPipe()) id: string): Promise<void> {
    return this.deletePayCycleUseCase.execute(id);
  }

  // ── Cycle resolution ───────────────────────────────────────────────────────

  @Get("current")
  @ApiOperation({
    summary: "Get the current financial cycle boundaries",
    description:
      "Returns today's cycle (startDate, endDate, label). No transaction data.",
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        label: "Marzo 2024",
        startDate: "2024-02-27",
        endDate: "2024-03-26",
      },
    },
  })
  getCurrentCycle() {
    return this.resolutionPayCycleUseCase.getCurrentCycle();
  }

  @Get("resolve")
  @ApiOperation({
    summary: "Resolve which financial cycle a date belongs to",
    description:
      "Pass any YYYY-MM-DD date and get back the cycle that contains it.",
  })
  @ApiQuery({ name: "date", required: true, example: "2024-03-10" })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        label: "Marzo 2024",
        startDate: "2024-02-27",
        endDate: "2024-03-26",
      },
    },
  })
  resolveCycle(
    @Query("userId") userId: string,
    @Query("date") date: string
  ) {
    return this.resolutionPayCycleUseCase.getCycleForDate(date, userId);
  }

  // ── Summaries ──────────────────────────────────────────────────────────────

  @Get("summary")
  @ApiOperation({
    summary: "Get income/expense summary for a specific financial cycle",
    description:
      "Pass `date` (any date inside the desired cycle) to get that cycle's summary. " +
      "Omit `date` to get the current cycle.",
  })
  @ApiQuery({ name: "date", required: false, example: "2024-03-10" })
  @ApiResponse({
    status: 200,
    description:
      "Cycle summary with income, expense, balance, and category breakdown",
    schema: {
      example: {
        cycle: {
          label: "Marzo 2024",
          startDate: "2024-02-27",
          endDate: "2024-03-26",
        },
        income: 5000000,
        expense: 2300000,
        balance: 2700000,
        transactionCount: 8,
        categoryBreakdown: [
          {
            categoryId: "1",
            categoryName: "Hogar",
            categoryEmoji: "🏠",
            total: 1500000,
          },
        ],
      },
    },
  })
  getCycleSummary(
    @Query("userId") userId: string,
    @Query("date") date?: string
  ): Promise<CycleSummary> {
    return this.summaryPayCycleUseCase.getCycleSummary(userId, date);
  }

  @Get()
  @ApiOperation({
    summary: "List all financial cycles with their summaries",
    description:
      "Returns every cycle that has at least one transaction, most recent first. " +
      "Optionally filter by date range with `from` and `to`.",
  })
  @ApiQuery({ name: "from", required: false, example: "2024-01-01" })
  @ApiQuery({ name: "to", required: false, example: "2024-12-31" })
  @ApiResponse({ status: 200, description: "Array of cycle summaries" })
  getAllCycles(
    @Query("userId") userId: string,
    @Query("from") from?: string,
    @Query("to") to?: string,
  ): Promise<CycleSummary[]> {
    return this.findAllPayCyclesUseCase.getAllCycles(userId, from, to);
  }
}
