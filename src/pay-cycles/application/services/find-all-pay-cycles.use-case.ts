import { Inject, Injectable } from "@nestjs/common";
import { PayCycleRepositoryInterface } from "src/pay-cycles/domain/repositories/pay-cycle.repository-interface";
import { PayCycleResponseDto } from "../dto/pay-cycle-response.dto";
import { TransactionRepositoryInterface } from "src/transactions/domain/repositories/transaction.repository-interface";
import {
  compareDates,
  cycleFromPayDates,
  CycleSummary,
} from "../helpers/pay-cycles.helpers";
import { SummaryPayCycleUseCase } from "./summary-pay-cycle-use-case";

@Injectable()
export class FindAllPayCyclesUseCase {
  constructor(
    @Inject("PayCycleRepositoryInterface")
    private readonly payCycleRepository: PayCycleRepositoryInterface,
    @Inject("TransactionRepositoryInterface")
    private readonly transactionRepository: TransactionRepositoryInterface,
    private readonly summaryPayCycleUseCase: SummaryPayCycleUseCase,
  ) {}

  async execute(userId: string): Promise<PayCycleResponseDto[]> {
    const payCycles = await this.payCycleRepository.findMany({
      conditions: { userId: userId },
    });
    return payCycles.map((pc) => PayCycleResponseDto.fromEntities(pc));
  }

  async getAllCycles(userId: string, from?: string, to?: string): Promise<CycleSummary[]> {
    const earliest = (await this.transactionRepository.aggregate())._min;
    const latest = (await this.transactionRepository.aggregate())._max;

    if (!earliest?.date) return []; // no transactions yet
    if (!latest?.date) return []; // no transactions yet

    const rangeFrom = from ?? earliest.date;
    const rangeTo = to ?? latest.date;

    if (compareDates(rangeFrom, rangeTo) > 0) return [];

    const payCycles = await this.payCycleRepository.findMany({
      conditions: {
        userId: userId,
        firstPaydate: { lte: rangeTo },
        lastPayDate: { gte: rangeFrom },
      },
    });

    const cycles = payCycles
      .map((payCycle) =>
        cycleFromPayDates(payCycle.firstPaydate, payCycle.lastPayDate),
      )
      .sort((a, b) => compareDates(a.startDate, b.startDate));

    const summaries = await Promise.all(
      cycles.map((c) => this.summaryPayCycleUseCase.buildCycleSummary(userId, c)),
    );

    return summaries.reverse().filter((s) => s.transactionCount > 0);
  }
}
