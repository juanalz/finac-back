import { Injectable, Inject } from '@nestjs/common';
import { DomainException } from '../../../modules/pino/domain/exceptions/domain.exception';
import { CategoryRepositoryInterface } from 'src/categories/domain/repositories/category.repository-interface';
import { CategoryResponseDto } from '../dto/category-response.dto';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject('CategoryRepositoryInterface')
    private readonly categoryRepositoryInterface: CategoryRepositoryInterface,
  ) {}

  async execute(createCategories: CreateCategoryDto[]): Promise<CategoryResponseDto[]> {
    const categoryIds = [...new Set(createCategories.map(cty => cty.name).filter(id => !!id))];
    
    if (categoryIds.length > 0) {
      const foundCategories = await this.categoryRepositoryInterface.findMany({
        conditions: {
          id: { in: categoryIds },
        },
      });

      if (foundCategories.length === categoryIds.length) {
        throw new DomainException(
          `The following categories already exist: ${foundCategories.map(cty => cty.name).join(', ')}. Please choose different names for the new categories.`,
        );
      }
    }

    const categories = await this.categoryRepositoryInterface.createMany(
      createCategories.map(category => ({ ...category,  })),
    );

    return categories.map(category => CategoryResponseDto.fromEntities(category));
  }
}
