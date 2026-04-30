import { Inject, Injectable } from '@nestjs/common';
import { TransactionRepositoryInterface } from 'src/transactions/domain/repositories/transaction.repository-interface';
import { TransactionResponseDto } from '../dto/transaction-response.dto';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject('TransactionRepositoryInterface')
    private readonly transactionRepository: TransactionRepositoryInterface,
  ) {}

  async execute(createTransactions: CreateTransactionDto[]): Promise<TransactionResponseDto[]> {
    const transactions = await this.transactionRepository.createMany(
      createTransactions.map(transaction => ({ ...transaction,  })),
    );

    return transactions.map(transaction => TransactionResponseDto.fromEntities(transaction));
  }
}
