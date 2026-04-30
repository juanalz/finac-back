import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TransactionType } from '../../../transactions/domain/entities/transaction.entity';

export interface CategoryBreakdown {
  categoryId: string | null;
  categoryName: string;
  categoryEmoji: string;
  total: number;
}

export interface SummaryResult {
  income: number;
  expense: number;
  balance: number;
  transactionCount: number;
  categoryBreakdown: CategoryBreakdown[];
}

@Injectable()
export class SummaryService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async getSummary(from?: string, to?: string): Promise<SummaryResult> {
    const where: any = {};

    if (from || to) {
      where.date = {
        ...(from ? { gte: from } : {}),
        ...(to ? { lte: to } : {}),
      };
    }

    const transactions = await this.prisma.transaction.findMany({
      where,
      include: { category: true },
    });

    let income = 0;
    let expense = 0;
    const catMap: Record<string, CategoryBreakdown> = {};

    for (const tx of transactions) {
      const amount = Number(tx.amount);

      if (tx.type === TransactionType.INCOME) {
        income += amount;
      } else {
        expense += amount;

        const key = tx.categoryId ?? 'uncategorized';
        if (!catMap[key]) {
          catMap[key] = {
            categoryId: tx.categoryId ?? null,
            categoryName: (tx as any).category?.name ?? 'Sin categoría',
            categoryEmoji: (tx as any).category?.emoji ?? '📦',
            total: 0,
          };
        }
        catMap[key].total += amount;
      }
    }

    const categoryBreakdown = Object.values(catMap).sort((a, b) => b.total - a.total);

    return {
      income: +income.toFixed(2),
      expense: +expense.toFixed(2),
      balance: +(income - expense).toFixed(2),
      transactionCount: transactions.length,
      categoryBreakdown,
    };
  }
}
