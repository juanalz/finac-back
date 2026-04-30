import { Inject, Injectable } from '@nestjs/common';
import { PayCycleRepositoryInterface } from 'src/pay-cycles/domain/repositories/pay-cycle.repository-interface';
import { PayCycleResponseDto } from '../dto/pay-cycle-response.dto';
import { TransactionRepositoryInterface } from 'src/transactions/domain/repositories/transaction.repository-interface';
import { compareDates, cyclesInRange, CycleSummary } from '../helpers/pay-cycles.helpers';
import { SummaryPayCycleUseCase } from './summary-pay-cycle-use-case';
import { FindOnePayCycleUseCase } from './find-one-pay-cycle.use-case';

@Injectable()
export class FindAllPayCyclesUseCase {
  constructor(
    @Inject('PayCycleRepositoryInterface')
    private readonly payCycleRepository: PayCycleRepositoryInterface,
    @Inject('TransactionRepositoryInterface')
    private readonly transactionRepository: TransactionRepositoryInterface,
    private readonly findOnePayCycleUseCase: FindOnePayCycleUseCase,
    private readonly summaryPayCycleUseCase: SummaryPayCycleUseCase,
  ) {}

  async execute(): Promise<PayCycleResponseDto[]> {
    const payCycles = await this.payCycleRepository.findMany({ conditions: {} });
    return payCycles.map(pc => PayCycleResponseDto.fromEntities(pc));
  }

  async getAllCycles(from?: string, to?: string): Promise<CycleSummary[]> {
    const cfg = await this.findOnePayCycleUseCase.execute();

    // Find the earliest and latest transaction dates to bound our search
    const earliest = (await this.transactionRepository.aggregate())._min;
    console.log('earliest:', earliest);

    const latest = (await this.transactionRepository.aggregate())._max;
    console.log('latest:', latest);

    if (!earliest?.date) return []; // no transactions yet
    if (!latest?.date) return []; // no transactions yet

    const rangeFrom = from ?? earliest.date;
    const rangeTo = to ?? latest.date;

    if (compareDates(rangeFrom, rangeTo) > 0) return [];

    const cycles = cyclesInRange(
      rangeFrom,
      rangeTo,
      cfg.firstPaydate,
      cfg.paydayType,
      cfg.paydayValue,
    );

    // Build summaries in parallel
    const summaries = await Promise.all(cycles.map((c) => this.summaryPayCycleUseCase.buildCycleSummary(c)));

    // Return most-recent first, skip empty cycles if not explicitly requested
    return summaries.reverse().filter((s) => s.transactionCount > 0);
  }
}
