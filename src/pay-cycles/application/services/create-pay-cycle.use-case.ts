import { Inject, Injectable } from "@nestjs/common";
import { DomainException } from "src/modules/pino/domain/exceptions/domain.exception";
import { PayCycleRepositoryInterface } from "src/pay-cycles/domain/repositories/pay-cycle.repository-interface";
import { CreatePayCycleDto } from "../dto/create-pay-cycle.dto";
import { PayCycleResponseDto } from "../dto/pay-cycle-response.dto";
import { compareDates } from "../helpers/pay-cycles.helpers";

@Injectable()
export class CreatePayCycleUseCase {
  constructor(
    @Inject("PayCycleRepositoryInterface")
    private readonly payCycleRepository: PayCycleRepositoryInterface,
  ) {}

  async execute(dto: CreatePayCycleDto): Promise<PayCycleResponseDto> {
    if (compareDates(dto.firstPaydate, dto.lastPayDate) > 0) {
      throw new DomainException(
        "firstPaydate must be before or equal to lastPayDate",
      );
    }

    const payCycle = await this.payCycleRepository.create(dto);
    return PayCycleResponseDto.fromEntities(payCycle);
  }
}
