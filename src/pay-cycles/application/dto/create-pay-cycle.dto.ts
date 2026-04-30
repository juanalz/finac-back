import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { PaydayType } from '../../domain/entities/pay-cycle.entity';

export class CreatePayCycleDto {
  @ApiProperty({ enum: PaydayType, example: PaydayType.FIXED, description: 'Tipo de ciclo de pago' })
  @IsEnum(PaydayType)
  paydayType: PaydayType;

  @ApiProperty({ example: 15, description: 'Valor del día de pago (ej. día del mes o de la semana)' })
  @IsInt()
  @Min(1)
  @Max(31)
  paydayValue: number;

  @ApiProperty({ example: '2024-01-15', description: 'Fecha del primer pago (YYYY-MM-DD)' })
  @IsString()
  @IsNotEmpty()
  firstPaydate: string;
}
