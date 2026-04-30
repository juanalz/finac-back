import { Inject, Injectable } from '@nestjs/common';
import { CategoryRepositoryInterface } from 'src/categories/domain/repositories/category.repository-interface';
import { CategoryResponseDto } from '../dto/category-response.dto';

@Injectable()
export class FindAllCategoriesUseCase {
  constructor(
    @Inject('CategoryRepositoryInterface')
    private readonly categoryRepositoryInterface: CategoryRepositoryInterface,
  ) {}

  async execute(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepositoryInterface.findMany({ conditions: {} });

    return categories.map(category => CategoryResponseDto.fromEntities(category));
  }
}
  