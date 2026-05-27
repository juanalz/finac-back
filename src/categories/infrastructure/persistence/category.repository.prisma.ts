import { Inject, Injectable } from "@nestjs/common";
import { Prisma } from "../../../prisma/prisma-client/client";
import { PrismaService } from "src/prisma/prisma.service";
import { Category, CategoryProps } from "src/categories/domain/entities/category.entity";
import { CategoryRepositoryInterface } from "src/categories/domain/repositories/category.repository-interface";

@Injectable()
export class CategoryPrismaRepository implements CategoryRepositoryInterface {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async findMany({ conditions }: { conditions: Prisma.CategoryWhereInput }): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      where: conditions,
      orderBy: { name: "asc" },
    });

    if (!categories) return [];

    return categories.map(category => Category.fromPrisma(category as CategoryProps));
  }

  async findUnique({
    conditions,
  }: {
    conditions: Prisma.CategoryWhereInput;
  }): Promise<Category | null> {
    const category = await this.prisma.category.findFirst({
      where: conditions,
    });

    if (!category) return null;

    return Category.fromPrisma({
      ...category,
      emoji: category.emoji ?? undefined,
    });
  }

  async createMany(categories: CategoryProps[]): Promise<Category[]> {
    const categoriesCreated = await this.prisma.category.createManyAndReturn({
      data: categories,
    });

    return categoriesCreated.map(category =>
      Category.fromPrisma({
        ...category,
        emoji: category.emoji ?? undefined,
      }),
    );
  }

  async update(id: string, category: Partial<Category>): Promise<Category> {
    const { ...updateData } = category;
    const categoryUpdated = await this.prisma.category.update({
      where: { id },
      data: updateData,
    });

    return Category.fromPrisma({
      ...categoryUpdated,
      emoji: categoryUpdated.emoji ?? undefined,
    });
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.category.delete({ where: { id } });
    return true;
  }
}