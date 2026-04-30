import { Inject, Injectable } from '@nestjs/common';
import { DomainException } from 'src/modules/pino/domain/exceptions/domain.exception';
import { TransactionRepositoryInterface } from 'src/transactions/domain/repositories/transaction.repository-interface';
import { TransactionResponseDto } from '../dto/transaction-response.dto';

@Injectable()
export class FindOneTransactionUseCase {
  constructor(
    @Inject('TransactionRepositoryInterface')
    private readonly transactionRepository: TransactionRepositoryInterface,
  ) {}

  async execute(id: string): Promise<TransactionResponseDto> {
    const transaction = await this.transactionRepository.findUnique({ conditions: { id } });

    if (!transaction) throw new DomainException(`Transaction #${id} not found`);

    return TransactionResponseDto.fromEntities(transaction);
  }
}
