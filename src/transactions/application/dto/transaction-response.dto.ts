import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  Transaction,
  TransactionType,
} from "../../domain/entities/transaction.entity";
import { CategoryResponseDto } from "src/categories/application/dto/category-response.dto";
import { emoji } from "zod";

export class TransactionResponseDto {
  @ApiProperty({ example: "fb160441-660f-4e4d-af0b-b65d1a368b6f" })
  id: string;

  @ApiProperty({ example: "Pago de arriendo" })
  concept: string;

  @ApiProperty({ example: 1500000 })
  amount: number;

  @ApiProperty({ enum: TransactionType, example: TransactionType.EXPENSE })
  type: TransactionType;

  @ApiProperty({ example: "2024-03-15" })
  date: string;

  @ApiPropertyOptional({ example: "fb160441-660f-4e4d-af0b-b65d1a368b6f" })
  userId?: string | null;

  @ApiProperty({
    type: CategoryResponseDto,
    description: "Category associated with the transaction",
  })
  category?: CategoryResponseDto;

  constructor(transaction: Transaction) {
    this.id = transaction.id ?? "";
    this.concept = transaction.concept;
    this.amount = transaction.amount;
    this.type = transaction.type;
    this.date = transaction.date;
    this.userId = transaction.userId;
    this.category = transaction.category
      ? CategoryResponseDto.fromEntities({
          ...transaction.category,
          emoji: transaction.category.emoji ?? undefined,
        })
      : undefined;
  }

  static fromEntities(transaction: Transaction): TransactionResponseDto {
    return new TransactionResponseDto(transaction);
  }
}
