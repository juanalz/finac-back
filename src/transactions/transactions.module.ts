import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TransactionPrismaRepository } from './infrastructure/persistence/transaction.repository.prisma';
import { FindAllTransactionsUseCase } from './application/services/find-all-transactions.use-case';
import { FindOneTransactionUseCase } from './application/services/find-one-transaction.use-case';
import { CreateTransactionUseCase } from './application/services/create-transaction.use-case';
import { UpdateTransactionUseCase } from './application/services/update-transaction.use-case';
import { DeleteTransactionUseCase } from './application/services/delete-transaction.use-case';
import { TransactionsController } from './presentation/transactions.controller';

const useCases = [
  FindAllTransactionsUseCase,
  FindOneTransactionUseCase,
  CreateTransactionUseCase,
  UpdateTransactionUseCase,
  DeleteTransactionUseCase,
];

@Module({
  controllers: [TransactionsController],
  imports: [PrismaModule],
  providers: [
    ...useCases,
    {
      provide: 'TransactionRepositoryInterface',
      useClass: TransactionPrismaRepository,
    },
  ],
  exports: [
    {
      provide: 'TransactionRepositoryInterface',
      useClass: TransactionPrismaRepository,
    },
  ],
})
export class TransactionsModule {}
