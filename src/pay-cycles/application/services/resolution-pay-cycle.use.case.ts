import { Injectable } from '@nestjs/common';
import { cycleForDate, FinancialCycle } from '../helpers/pay-cycles.helpers';
import { FindOnePayCycleUseCase } from './find-one-pay-cycle.use-case';

@Injectable()
export class ResolutionPayCycleUseCase {
  constructor(
    private readonly findOnePayCycleUseCase: FindOnePayCycleUseCase,
  ) {}

  async getCurrentCycle(): Promise<FinancialCycle> {
    const today = new Date().toISOString().split('T')[0];
    return this.getCycleForDate(today);
  }

  async getCycleForDate(date: string): Promise<FinancialCycle> {
    console.log('Resolviendo ciclo para fecha:', date);
    const cfg = await this.findOnePayCycleUseCase.execute();
    return cycleForDate(date, cfg.firstPaydate, cfg.paydayType, cfg.paydayValue);
  }
}
