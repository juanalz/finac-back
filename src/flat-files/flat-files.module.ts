import { Module } from '@nestjs/common';
import { FlatFilesController } from './presentation/flat-files.controller';
import { UploadFileFlatUseCase } from './application/services/upload-file-flat.use-case';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PayCyclePrismaRepository } from 'src/pay-cycles/infrastructure/persistence/pay-cycle.repository.prisma';
import { TransactionPrismaRepository } from 'src/transactions/infrastructure/persistence/transaction.repository.prisma';

@Module({
  controllers: [FlatFilesController],
  imports: [PrismaModule],
  providers: [
    UploadFileFlatUseCase,
    {
      provide: 'PayCycleRepositoryInterface',
      useClass: PayCyclePrismaRepository,
    },
    {
      provide: 'TransactionRepositoryInterface',
      useClass: TransactionPrismaRepository,
    },
  ],
})
export class FlatFilesModule {}
