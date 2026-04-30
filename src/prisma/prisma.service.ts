import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { PrismaClient } from './prisma-client/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log:
        process.env.NODE_ENV === 'local' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      await this.$queryRaw`SELECT 1`;
      this.logger.log('✅ [Database] is connected ✅');
    } catch (error) {
      this.logger.error(`❌ [Database] connection failed: ${error} ❌`);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
