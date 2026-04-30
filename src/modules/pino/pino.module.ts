import { Global, Module } from '@nestjs/common';
import { PinoLoggerService } from './application/services/pino-logger.service';

@Global()
@Module({
  imports: [],
  providers: [PinoLoggerService],
  exports: [PinoLoggerService],
})
export class PinoModule {}
