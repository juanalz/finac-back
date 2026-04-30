import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { SummaryService, SummaryResult } from '../application/services/summary.service';
import { IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

class SummaryQueryDto {
  @ApiPropertyOptional({ example: '2024-01-01', description: 'Start date filter' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ example: '2024-12-31', description: 'End date filter' })
  @IsOptional()
  @IsDateString()
  to?: string;
}

@ApiTags('summary')
@Controller('summary')
export class SummaryController {
  constructor(private readonly service: SummaryService) {}

  @Get()
  @ApiOperation({
    summary: 'Dashboard summary',
    description:
      'Returns total income, expenses, balance, and per-category expense breakdown. ' +
      'Optionally filtered by a date range.',
  })
  @ApiResponse({
    status: 200,
    description: 'Summary object',
    schema: {
      example: {
        income: 5000000,
        expense: 2300000,
        balance: 2700000,
        transactionCount: 14,
        categoryBreakdown: [
          {
            categoryId: 1,
            categoryName: 'Hogar',
            categoryEmoji: '🏠',
            total: 1500000,
          },
        ],
      },
    },
  })
  getSummary(@Query() query: SummaryQueryDto): Promise<SummaryResult> {
    return this.service.getSummary(query.from, query.to);
  }
}
