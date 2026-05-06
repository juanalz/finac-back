import { Inject, Injectable } from "@nestjs/common";
import { DomainException } from "src/modules/pino/domain/exceptions/domain.exception";
import { PayCycleRepositoryInterface } from "src/pay-cycles/domain/repositories/pay-cycle.repository-interface";
import {
  cycleFromPayDates,
  FinancialCycle,
} from "../helpers/pay-cycles.helpers";

@Injectable()
export class ResolutionPayCycleUseCase {
  constructor(
    @Inject("PayCycleRepositoryInterface")
    private readonly payCycleRepository: PayCycleRepositoryInterface,
  ) {}

  async getCurrentCycle(): Promise<FinancialCycle> {
    const today = new Date().toISOString().split("T")[0];
    return this.getCycleForDate(today);
  }

  async getCycleForDate(date: string): Promise<FinancialCycle> {
    const payCycle = await this.payCycleRepository.findUnique({
      conditions: {
        firstPaydate: { lte: date },
        lastPayDate: { gte: date },
      },
    });

    if (!payCycle) {
      throw new DomainException(`No pay cycle found for date ${date}`);
    }

    return cycleFromPayDates(payCycle.firstPaydate, payCycle.lastPayDate);
  }
}
