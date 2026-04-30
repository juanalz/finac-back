import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsDateString,
  IsUUID,
  Min,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType } from '../../domain/entities/transaction.entity';

export class QueryTransactionDto {
  @ApiPropertyOptional({ enum: TransactionType, description: 'Filtrar por tipo' })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiPropertyOptional({ example: 'fb160441-660f-4e4d-af0b-b65d1a368b6f', description: 'Filtrar por ID de categoría (UUID)' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ example: '2024-01-01', description: 'Fecha inicial (inclusive)' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ example: '2024-12-31', description: 'Fecha final (inclusive)' })
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiPropertyOptional({ example: 1, description: 'Número de página (comienza en 1)', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, description: 'Resultados por página', default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 20;
}
