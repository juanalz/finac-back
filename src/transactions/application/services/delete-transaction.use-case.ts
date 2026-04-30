import { Inject, Injectable } from '@nestjs/common';
import { DomainException } from 'src/modules/pino/domain/exceptions/domain.exception';
import { TransactionRepositoryInterface } from 'src/transactions/domain/repositories/transaction.repository-interface';

@Injectable()
export class DeleteTransactionUseCase {
  constructor(
    @Inject('TransactionRepositoryInterface')
    private readonly transactionRepository: TransactionRepositoryInterface,
  ) {}

  async execute(id: string): Promise<void> {
    const transaction = await this.transactionRepository.findUnique({ conditions: { id } });

    if (!transaction) throw new DomainException(`Transaction #${id} not found`);

    await this.transactionRepository.delete(id);
  }
}
