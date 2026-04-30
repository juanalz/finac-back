import { Logger } from '@nestjs/common';
import dotenv from 'dotenv';
import z from 'zod';

dotenv.config();

const logger = new Logger('Configuration');

export interface Config {
  port: number;
  nodeEnv: string;
  logLevel: string;
  cors: string[];
  databaseUsl: string;
  accessTokenSecret: string;
  accessTokenExpiresIn: string;
  redis: {
    url: string;
    cacheTtl: number;
  };
}

export default (): Config => {
  const envSchema = z.object({
    PORT: z.preprocess(val => Number(val), z.number().positive().default(3001)),
    NODE_ENV: z
      .enum(['local', 'development', 'production', 'staging', 'test'])
      .default('development'),
    LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
    CORS_ORIGINS: z.string(),
    DATABASE_URL: z.url(),
    ACCESS_TOKEN_SECRET: z.string(),
    ACCESS_TOKEN_EXPIRES_IN: z.string().default('30Min'),
    REDIS_URL: z.string(),
    REDIS_CACHE_TTL: z.preprocess(val => Number(val), z.number().positive()),
  });

  const result = envSchema.safeParse(process.env);

  if (result.error) {
    logger.error('❌ Invalid env variables ❌:');
    const formattedErrors = z.prettifyError(result.error);
    if (formattedErrors) {
      logger.error(formattedErrors);
    }
    process.exit(1);
  }

  logger.log(`✅ Configuration loaded for ${result.data.NODE_ENV} mode ✅`);

  return {
    port: result.data.PORT,
    nodeEnv: result.data.NODE_ENV,
    logLevel: result.data.LOG_LEVEL,
    cors: result.data.CORS_ORIGINS.split(',').map(url => url.trim()),
    databaseUsl: result.data.DATABASE_URL,
    accessTokenSecret: result.data.ACCESS_TOKEN_SECRET,
    accessTokenExpiresIn: result.data.ACCESS_TOKEN_EXPIRES_IN,
    redis: {
      url: result.data.REDIS_URL,
      cacheTtl: result.data.REDIS_CACHE_TTL,
    },
  };
};
