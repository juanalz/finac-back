import { Inject, Injectable } from "@nestjs/common";
import { CycleSummary, FinancialCycle } from "../helpers/pay-cycles.helpers";
import { TransactionRepositoryInterface } from "src/transactions/domain/repositories/transaction.repository-interface";
import { TransactionType } from "src/transactions/domain/entities/transaction.entity";
import { ResolutionPayCycleUseCase } from "./resolution-pay-cycle.use.case";

@Injectable()
export class SummaryPayCycleUseCase {
  constructor(
    @Inject("TransactionRepositoryInterface")
    private readonly transactionRepository: TransactionRepositoryInterface,
    private readonly resolutionPayCycleUseCase: ResolutionPayCycleUseCase,
  ) {}

  async getCycleSummary(cycleStart?: string): Promise<CycleSummary> {
    const anchor = cycleStart ?? new Date().toISOString().split("T")[0];
    const cycle = await this.resolutionPayCycleUseCase.getCycleForDate(anchor);

    return this.buildCycleSummary(cycle);
  }

  async buildCycleSummary(cycle: FinancialCycle): Promise<CycleSummary> {
    const transactions = await this.transactionRepository.findAll({
      conditions: { date: { gte: cycle.startDate, lte: cycle.endDate } },
    });

    let income = 0;
    let expense = 0;
    const catMap: Record<
      string,
      {
        categoryId: string | null;
        categoryName: string;
        categoryEmoji: string;
        total: number;
      }
    > = {};

    for (const tx of transactions) {
      const amount = Number(tx.amount);
      if (tx.type === TransactionType.INCOME) {
        income += amount;
      } else {
        expense += amount;
        const key = tx.categoryId?.toString() ?? "none";
        if (!catMap[key]) {
          catMap[key] = {
            categoryId: tx.categoryId ?? null,
            categoryName: tx.category?.name ?? "Sin categoría",
            categoryEmoji: tx.category?.emoji ?? "📦",
            total: 0,
          };
        }
        catMap[key].total += amount;
      }
    }

    return {
      cycle,
      income: +income.toFixed(2),
      expense: +expense.toFixed(2),
      balance: +(income - expense).toFixed(2),
      transactionCount: transactions.length,
      categoryBreakdown: Object.values(catMap).sort(
        (a, b) => b.total - a.total,
      ),
    };
  }
}
