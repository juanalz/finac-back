import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, { Config } from './config/config';
import { PinoModule } from './modules/pino/pino.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CategoriesModule } from './categories/categories.module';
import { SummaryModule } from './summary/summary.module';
import { PayCyclesModule } from './pay-cycles/pay-cycles.module';
import { FlatFilesModule } from './flat-files/flat-files.module';

@Module({
  imports: [
    TransactionsModule,
    CategoriesModule,
    SummaryModule,
    PayCyclesModule,
    PinoModule,
    FlatFilesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [configuration],
    }),
  ],
  providers: [
    {
      provide: ConfigService,
      useClass: ConfigService<Config>,
    },
  ],
})
export class AppModule {}
