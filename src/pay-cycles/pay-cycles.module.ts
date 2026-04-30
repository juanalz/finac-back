import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PayCyclePrismaRepository } from './infrastructure/persistence/pay-cycle.repository.prisma';
import { FindAllPayCyclesUseCase } from './application/services/find-all-pay-cycles.use-case';
import { FindOnePayCycleUseCase } from './application/services/find-one-pay-cycle.use-case';
import { CreatePayCycleUseCase } from './application/services/create-pay-cycle.use-case';
import { UpdatePayCycleUseCase } from './application/services/update-pay-cycle.use-case';
import { DeletePayCycleUseCase } from './application/services/delete-pay-cycle.use-case';
import { PayCyclesController } from './presentation/pay-cycles.controller';
import { TransactionPrismaRepository } from 'src/transactions/infrastructure/persistence/transaction.repository.prisma';
import { ResolutionPayCycleUseCase } from './application/services/resolution-pay-cycle.use.case';
import { SummaryPayCycleUseCase } from './application/services/summary-pay-cycle-use-case';

const useCases = [
  FindAllPayCyclesUseCase,
  FindOnePayCycleUseCase,
  CreatePayCycleUseCase,
  UpdatePayCycleUseCase,
  DeletePayCycleUseCase,
  ResolutionPayCycleUseCase,
  SummaryPayCycleUseCase,
];

@Module({
  controllers: [PayCyclesController],
  imports: [PrismaModule],
  providers: [
    ...useCases,
    {
      provide: 'PayCycleRepositoryInterface',
      useClass: PayCyclePrismaRepository,
    },
    {
      provide: 'TransactionRepositoryInterface',
      useClass: TransactionPrismaRepository,
    },
  ],
  exports: [
    {
      provide: 'PayCycleRepositoryInterface',
      useClass: PayCyclePrismaRepository,
    },
  ],
})
export class PayCyclesModule {}
