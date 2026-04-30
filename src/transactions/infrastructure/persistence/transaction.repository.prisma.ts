import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '../../../prisma/prisma-client/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  Transaction,
  TransactionProps,
} from 'src/transactions/domain/entities/transaction.entity';
import {
  TransactionRepositoryInterface,
  PaginatedTransactions,
  PaginationOptions,
} from 'src/transactions/domain/repositories/transaction.repository-interface';

@Injectable()
export class TransactionPrismaRepository implements TransactionRepositoryInterface {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async findMany({
    conditions,
    pagination,
  }: {
    conditions: Prisma.TransactionWhereInput;
    pagination?: PaginationOptions;
  }): Promise<PaginatedTransactions> {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 20;

    const [raw, total] = await this.prisma.$transaction([
      this.prisma.transaction.findMany({
        where: conditions,
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: { category: true },
      }),
      this.prisma.transaction.count({ where: conditions }),
    ]);

    return {
      data: raw.map(t => Transaction.fromPrisma(t as unknown as TransactionProps)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAll({
    conditions,
  }: {
    conditions: Prisma.TransactionWhereInput;
  }): Promise<Transaction[]> {

    const transactions = await this.prisma.transaction.findMany({
        where: conditions,
        orderBy: [{ date: 'desc' }],
        include: { category: true },
      });

    return transactions.map(transaction => Transaction.fromPrisma(transaction as unknown as TransactionProps));
  }

  async findUnique({
    conditions,
  }: {
    conditions: Prisma.TransactionWhereInput;
  }): Promise<Transaction | null> {
    const record = await this.prisma.transaction.findFirst({ where: conditions });

    if (!record) return null;

    return Transaction.fromPrisma(record as unknown as TransactionProps);
  }

  async createMany(transactions: TransactionProps[]): Promise<Transaction[]> {
    const transactionsCreated = await this.prisma.transaction.createManyAndReturn({
      data: transactions as unknown as Prisma.TransactionCreateManyInput[],
    });

    return transactionsCreated.map(transaction =>
      Transaction.fromPrisma(transaction as unknown as TransactionProps),
    );
  }

  async update(id: string, transaction: Partial<TransactionProps>): Promise<Transaction> {
    const record = await this.prisma.transaction.update({
      where: { id },
      data: transaction as unknown as Prisma.TransactionUpdateInput,
    });

    return Transaction.fromPrisma(record as unknown as TransactionProps);
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.transaction.delete({ where: { id } });
    return true;
  }

  async aggregate() {
    return await this.prisma.transaction.aggregate({
      _min: {
        date: true,
      },
      _max: {
        date: true,
      },
    });
  }
}
