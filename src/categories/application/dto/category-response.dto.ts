import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../domain/entities/category.entity';

export class CategoryResponseDto {
  @ApiProperty({
    example: 'fb160441-660f-4e4d-af0b-b65d1a368b6f',
    description: "Category's unique ID",
  })
  id: string;

  @ApiProperty({
    example: 'Electronics',
    description: 'Category name',
  })
  name: string;

  @ApiProperty({
    example: '📱',
    description: 'Category emoji',
  })
  emoji: string;

  constructor(category: Category) {
    this.id = category.id || '';
    this.name = category.name;
    this.emoji = category.emoji || '';
  }

  static fromEntities(category: Category): CategoryResponseDto {
    return new CategoryResponseDto(category);
  }
}
