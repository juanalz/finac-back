import { Inject, Injectable } from '@nestjs/common';
import { DomainException } from 'src/modules/pino/domain/exceptions/domain.exception';
import { CategoryRepositoryInterface } from 'src/categories/domain/repositories/category.repository-interface';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    @Inject('CategoryRepositoryInterface')
    private readonly categoryRepositoryInterface: CategoryRepositoryInterface,
  ) {}

  async execute(id: string): Promise<void> {
    const category = await this.categoryRepositoryInterface.findUnique({ conditions: { id } });

    if (!category) throw new DomainException(`Category #${id} not found`);

    await this.categoryRepositoryInterface.delete(id);
  }
}
  