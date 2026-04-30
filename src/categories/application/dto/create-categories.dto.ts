import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

export class CreateCategoriesDto {
  @ApiProperty({
    example: 'Hogar, Transporte, Comida',
    description: "Categories",
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateCategoryDto)
  items: CreateCategoryDto[];
}
