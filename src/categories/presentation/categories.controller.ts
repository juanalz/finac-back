import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { FindAllCategoriesUseCase } from '../application/services/find-all-categories.use-case';
import { FindOneCategoryUseCase } from '../application/services/find-one-category.use-case';
import { CreateCategoryUseCase } from '../application/services/create-category.use-case';
import { DeleteCategoryUseCase } from '../application/services/delete-category.use-case';
import { CategoryResponseDto } from '../application/dto/category-response.dto';
import { CreateCategoriesDto } from '../application/dto/create-categories.dto';
import { UpdateCategoryDto } from '../application/dto/update-category.dto';
import { UpdateCategoryUseCase } from '../application/services/update-category.use-case';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly findAllCategoriesUseCase: FindAllCategoriesUseCase,
    private readonly findOneCategoryUseCase: FindOneCategoryUseCase,
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all categories' })
  @ApiResponse({ status: 200, type: [CategoryResponseDto] })
  findAll(): Promise<CategoryResponseDto[]> {
    return this.findAllCategoriesUseCase.execute();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a single category by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: CategoryResponseDto })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number
  ): Promise<CategoryResponseDto> {
    return this.findOneCategoryUseCase.execute(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, type: CategoryResponseDto })
  @ApiResponse({ status: 409, description: 'Category name already exists' })
  async create(
    @Body() createCategories: CreateCategoriesDto
  ): Promise<CategoryResponseDto[]> {
    const { items } = createCategories;
    return this.createCategoryUseCase.execute(items);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ status: 200, type: CategoryResponseDto })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCategory: UpdateCategoryDto
  ): Promise<boolean> {
    return this.updateCategoryUseCase.execute(id, updateCategory);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a category' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404, description: 'Category not found' })
  remove(
    @Param('id', new ParseUUIDPipe()) id: string
  ): Promise<void> {
    return this.deleteCategoryUseCase.execute(id);
  }
}
