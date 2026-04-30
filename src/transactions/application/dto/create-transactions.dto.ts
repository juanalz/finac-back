import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateTransactionDto } from './create-transaction.dto';

export class CreateTransactionsDto {
  @ApiProperty({
    example: 'Pago Servicios',
    description: "Transactions",
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionDto)
  items: CreateTransactionDto[];
}
