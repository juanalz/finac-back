import { ApiProperty } from '@nestjs/swagger';
import { PayCycle } from '../../domain/entities/pay-cycle.entity';
import { PaydayType } from '../../domain/entities/pay-cycle.entity';

export class PayCycleResponseDto {
  @ApiProperty({ example: 'fb160441-660f-4e4d-af0b-b65d1a368b6f', description: 'ID único del ciclo de pago' })
  id: string;

  @ApiProperty({ enum: PaydayType, example: PaydayType.FIXED, description: 'Tipo de ciclo de pago' })
  paydayType: PaydayType;

  @ApiProperty({ example: 15, description: 'Valor del día de pago' })
  paydayValue: number;

  @ApiProperty({ example: '2024-01-15', description: 'Fecha del primer pago' })
  firstPaydate: string;

  constructor(payCycle: PayCycle) {
    this.id = payCycle.id ?? '';
    this.paydayType = payCycle.paydayType;
    this.paydayValue = payCycle.paydayValue;
    this.firstPaydate = payCycle.firstPaydate;
  }

  static fromEntities(payCycle: PayCycle): PayCycleResponseDto {
    return new PayCycleResponseDto(payCycle);
  }
}
