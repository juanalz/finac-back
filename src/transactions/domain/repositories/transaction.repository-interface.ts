import { Transaction, TransactionProps } from '../entities/transaction.entity';

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedTransactions {
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TransactionRepositoryInterface {
  findMany(options: {
    conditions: any;
    pagination?: PaginationOptions;
  }): Promise<PaginatedTransactions>;
  findAll({
    conditions,
  }: {
    conditions: any;
  }): Promise<Transaction[]>;
  findUnique({ conditions }: { conditions: any }): Promise<Transaction | null>;
  createMany(transactions: TransactionProps[]): Promise<Transaction[]>;
  update(id: string, transaction: Partial<TransactionProps>): Promise<Transaction>;
  delete(id: string): Promise<boolean>;
  aggregate(): Promise<{ _min: { date: string | null }; _max: { date: string | null } }>;
}
