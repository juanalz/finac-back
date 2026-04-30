import { Inject, Injectable } from '@nestjs/common';
import { DomainException } from 'src/modules/pino/domain/exceptions/domain.exception';
import { TransactionRepositoryInterface } from 'src/transactions/domain/repositories/transaction.repository-interface';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';

@Injectable()
export class UpdateTransactionUseCase {
  constructor(
    @Inject('TransactionRepositoryInterface')
    private readonly transactionRepository: TransactionRepositoryInterface,
  ) {}

  async execute(id: string, dto: UpdateTransactionDto): Promise<boolean> {
    const exists = await this.transactionRepository.findUnique({ conditions: { id } });

    if (!exists) throw new DomainException(`Transaction #${id} not found`);

    await this.transactionRepository.update(id, dto);
    return true;
  }
}
