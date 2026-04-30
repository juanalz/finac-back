import { Inject, Injectable } from '@nestjs/common';
import { TransactionRepositoryInterface, PaginatedTransactions } from 'src/transactions/domain/repositories/transaction.repository-interface';
import { QueryTransactionDto } from '../dto/query-transaction.dto';

@Injectable()
export class FindAllTransactionsUseCase {
  constructor(
    @Inject('TransactionRepositoryInterface')
    private readonly transactionRepository: TransactionRepositoryInterface,
  ) {}

  async execute(query: QueryTransactionDto): Promise<PaginatedTransactions> {
    const { type, categoryId, from, to, page = 1, limit = 20 } = query;

    const conditions: any = {};

    if (type) conditions.type = type;
    if (categoryId) conditions.categoryId = categoryId;
    if (from || to) {
      conditions.date = {
        ...(from ? { gte: from } : {}),
        ...(to ? { lte: to } : {}),
      };
    }

    return this.transactionRepository.findMany({ conditions, pagination: { page, limit } });
  }
}
