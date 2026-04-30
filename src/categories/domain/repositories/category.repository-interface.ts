import { Category } from "../entities/category.entity";

export interface CategoryRepositoryInterface {
  findMany({ conditions }: { conditions: any }): Promise<Category[]>;
  findUnique({
    conditions,
    include,
  }: {
    conditions: any;
    include?: any;
  }): Promise<Category | null>;
  createMany(categories: Category[]): Promise<Category[]>;
  update(id: string, category: Partial<Category>): Promise<Category>;
  delete(id: string): Promise<boolean>;
}
