import { Inject, Injectable } from '@nestjs/common';
import { DomainException } from 'src/modules/pino/domain/exceptions/domain.exception';
import { PayCycleRepositoryInterface } from 'src/pay-cycles/domain/repositories/pay-cycle.repository-interface';

@Injectable()
export class DeletePayCycleUseCase {
  constructor(
    @Inject('PayCycleRepositoryInterface')
    private readonly payCycleRepository: PayCycleRepositoryInterface,
  ) {}

  async execute(id: string): Promise<void> {
    const payCycle = await this.payCycleRepository.findUnique({ conditions: { id } });

    if (!payCycle) throw new DomainException(`PayCycle #${id} not found`);

    await this.payCycleRepository.delete(id);
  }
}
