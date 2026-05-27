import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import configuration, { Config } from "./config/config";
import { PinoModule } from "./modules/pino/pino.module";
import { TransactionsModule } from "./transactions/transactions.module";
import { CategoriesModule } from "./categories/categories.module";
import { SummaryModule } from "./summary/summary.module";
import { PayCyclesModule } from "./pay-cycles/pay-cycles.module";
import { FlatFilesModule } from "./flat-files/flat-files.module";
import { AuthModule } from "./auth/auth.module";
import { JwtAuthGuard } from "./auth/application/guards/jwt-auth.guard";
import { RolesGuard } from "./auth/application/guards/roles.guard";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    TransactionsModule,
    AuthModule,
    UsersModule,
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
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
