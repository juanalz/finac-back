import { Inject, Injectable } from '@nestjs/common';
import { DomainException } from '../../../modules/pino/domain/exceptions/domain.exception';
import { CategoryRepositoryInterface } from 'src/categories/domain/repositories/category.repository-interface';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryResponseDto } from '../dto/category-response.dto';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject('CategoryRepositoryInterface')
    private readonly categoryRepositoryInterface: CategoryRepositoryInterface,
  ) {}

  async execute(
    id: string,
    updateCategory: UpdateCategoryDto,
  ): Promise<boolean> {
    const categoryExists = await this.categoryRepositoryInterface.findUnique({
      conditions: { id },
    });

    if (!categoryExists) throw new DomainException('Category not found');

    await this.categoryRepositoryInterface.update(id, updateCategory);

    return true;
  }
}
