import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SummaryService } from './application/services/summary.service';
import { SummaryController } from './presentation/summary.controller';

@Module({
  imports: [PrismaModule],
  providers: [SummaryService],
  controllers: [SummaryController],
})
export class SummaryModule {}
