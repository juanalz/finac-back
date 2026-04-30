import { Inject, Injectable } from '@nestjs/common';
import { DomainException } from 'src/modules/pino/domain/exceptions/domain.exception';
import { PayCycleRepositoryInterface } from 'src/pay-cycles/domain/repositories/pay-cycle.repository-interface';
import { PayCycleResponseDto } from '../dto/pay-cycle-response.dto';

@Injectable()
export class FindOnePayCycleUseCase {
  constructor(
    @Inject('PayCycleRepositoryInterface')
    private readonly payCycleRepository: PayCycleRepositoryInterface,
  ) {}

  async execute(): Promise<PayCycleResponseDto> {
    const payCycle = await this.payCycleRepository.findUnique({ conditions: { } });

    if (!payCycle) throw new DomainException(`Pay-cycle configuration not set yet`);

    return PayCycleResponseDto.fromEntities(payCycle);
  }
}
  