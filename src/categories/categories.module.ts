import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './domain/entities/category.entity';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CategoryPrismaRepository } from './infrastructure/persistence/category.repository.prisma';
import { FindAllCategoriesUseCase } from './application/services/find-all-categories.use-case';
import { FindOneCategoryUseCase } from './application/services/find-one-category.use-case';
import { CreateCategoryUseCase } from './application/services/create-category.use-case';
import { UpdateCategoryUseCase } from './application/services/update-category.use-case';
import { DeleteCategoryUseCase } from './application/services/delete-category.use-case';
import { CategoriesController } from './presentation/categories.controller';

const useCases = [
  FindAllCategoriesUseCase,
  FindOneCategoryUseCase,
  CreateCategoryUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
];

@Module({
  controllers: [CategoriesController],
  imports: [PrismaModule],
  providers: [
    ...useCases,
    {
      provide: 'CategoryRepositoryInterface',
      useClass: CategoryPrismaRepository,
    },
  ],
  exports: [
    {
      provide: 'CategoryRepositoryInterface',
      useClass: CategoryPrismaRepository,
    },
  ],
})
export class CategoriesModule {}
