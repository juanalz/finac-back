import { Inject, Injectable } from "@nestjs/common";
import { DomainException } from "src/modules/pino/domain/exceptions/domain.exception";
import { PayCycleRepositoryInterface } from "src/pay-cycles/domain/repositories/pay-cycle.repository-interface";
import { UpdatePayCycleDto } from "../dto/update-pay-cycle.dto";
import { PayCycleResponseDto } from "../dto/pay-cycle-response.dto";
import { compareDates } from "../helpers/pay-cycles.helpers";

@Injectable()
export class UpdatePayCycleUseCase {
  constructor(
    @Inject("PayCycleRepositoryInterface")
    private readonly payCycleRepository: PayCycleRepositoryInterface,
  ) {}

  async execute(
    id: string,
    dto: UpdatePayCycleDto,
  ): Promise<PayCycleResponseDto> {
    const exists = await this.payCycleRepository.findUnique({
      conditions: { id },
    });

    if (!exists) throw new DomainException(`PayCycle #${id} not found`);

    const firstPaydate = dto.firstPaydate ?? exists.firstPaydate;
    const lastPayDate = dto.lastPayDate ?? exists.lastPayDate;

    if (compareDates(firstPaydate, lastPayDate) > 0) {
      throw new DomainException(
        "firstPaydate must be before or equal to lastPayDate",
      );
    }

    const payCycle = await this.payCycleRepository.update(id, dto);
    return PayCycleResponseDto.fromEntities(payCycle);
  }
}
