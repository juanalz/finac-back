import { Inject, Injectable } from '@nestjs/common';
import { PayCycleRepositoryInterface } from 'src/pay-cycles/domain/repositories/pay-cycle.repository-interface';
import { CreatePayCycleDto } from '../dto/create-pay-cycle.dto';
import { PayCycleResponseDto } from '../dto/pay-cycle-response.dto';
import { cycleLastDate } from '../helpers/pay-cycles.helpers';

@Injectable()
export class CreatePayCycleUseCase {
  constructor(
    @Inject('PayCycleRepositoryInterface')
    private readonly payCycleRepository: PayCycleRepositoryInterface,
  ) {}

  async execute(dto: CreatePayCycleDto): Promise<PayCycleResponseDto> {

    let lastPayDate = cycleLastDate(dto.firstPaydate, dto.paydayType, dto.paydayValue);

    const data = {
      ...dto,
      lastPayDate: lastPayDate,
    }
    const payCycle = await this.payCycleRepository.create(data);
    return PayCycleResponseDto.fromEntities(payCycle);
  }
}
