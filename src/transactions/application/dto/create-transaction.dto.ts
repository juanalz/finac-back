import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsEnum,
  IsDateString,
  IsOptional,
  IsUUID,
  MaxLength,
} from "class-validator";
import { TransactionType } from "../../domain/entities/transaction.entity";

export class CreateTransactionDto {
  @ApiProperty({
    example: "Pago de arriendo",
    description: "Descripción de la transacción",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  concept: string;

  @ApiProperty({ example: 1500000, description: "Monto (debe ser positivo)" })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @ApiProperty({ enum: TransactionType, example: TransactionType.EXPENSE })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    example: "2024-03-15",
    description: "Fecha en formato YYYY-MM-DD",
  })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({
    example: "fb160441-660f-4e4d-af0b-b65d1a368b6f",
    description: "ID de la categoría (UUID)",
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;
}
