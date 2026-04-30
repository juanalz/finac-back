import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Hogar', description: 'Category name (must be unique)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name: string;

  @ApiPropertyOptional({ example: '🏠', description: 'Optional emoji icon' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  emoji?: string;
}
