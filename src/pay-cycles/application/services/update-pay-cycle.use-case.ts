import { Inject, Injectable } from '@nestjs/common';
import { DomainException } from 'src/modules/pino/domain/exceptions/domain.exception';
import { PayCycleRepositoryInterface } from 'src/pay-cycles/domain/repositories/pay-cycle.repository-interface';
import { UpdatePayCycleDto } from '../dto/update-pay-cycle.dto';

@Injectable()
export class UpdatePayCycleUseCase {
  constructor(
    @Inject('PayCycleRepositoryInterface')
    private readonly payCycleRepository: PayCycleRepositoryInterface,
  ) {}

  async execute(id: string, dto: UpdatePayCycleDto): Promise<boolean> {
    const exists = await this.payCycleRepository.findUnique({ conditions: { id } });

    if (!exists) throw new DomainException(`PayCycle #${id} not found`);

    await this.payCycleRepository.update(id, dto);
    return true;
  }
}
