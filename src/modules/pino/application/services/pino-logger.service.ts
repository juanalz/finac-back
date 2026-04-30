import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import pino, { Logger } from 'pino';
import { Config } from 'src/config/config';

@Injectable()
export class PinoLoggerService implements LoggerService {
  private readonly logger: Logger;

  constructor(private readonly configService: ConfigService<Config>) {
    const env: string = this.configService.get('nodeEnv') || '';
    this.logger = pino({
      level: this.configService.get('logLevel') || 'info',
      transport:
        env && ['development', 'local'].includes(env) ? { target: 'pino-pretty' } : undefined,
    });
  }

  log(msg: string, context?: string) {
    this.logger.info({ msg, context });
  }

  error(message: string, trace?: string, context?: string) {
    const msg = trace ? `${message}\n${trace}` : message;

    this.logger.error({ msg, context });
  }

  warn(msg: string, context?: string) {
    this.logger.warn({ msg, context });
  }

  debug(msg: string, context?: string) {
    this.logger.debug({ msg, context });
  }
}
