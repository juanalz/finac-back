import { Inject, Injectable } from '@nestjs/common';
import { DomainException } from 'src/modules/pino/domain/exceptions/domain.exception';
import { CategoryRepositoryInterface } from 'src/categories/domain/repositories/category.repository-interface';
import { CategoryResponseDto } from '../dto/category-response.dto';

@Injectable()
export class FindOneCategoryUseCase {
  constructor(
    @Inject('CategoryRepositoryInterface')
    private readonly categoryRepositoryInterface: CategoryRepositoryInterface,
  ) {}

  async execute(id: number): Promise<CategoryResponseDto> {
    const category = await this.categoryRepositoryInterface.findUnique({ conditions: { id } });

    if (!category) throw new DomainException(`Category #${id} not found`);

    return CategoryResponseDto.fromEntities(category);
  }
}