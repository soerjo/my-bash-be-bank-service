import * as dotenv from 'dotenv';
dotenv.config();
import { ConfigService, registerAs } from '@nestjs/config';
import * as Joi from 'joi';

interface IAppConfig {
  NODE_ENV: string;
  PORT: number;
  TZ: string;
  ENCRYPT_KEY: string;
  DATABASE_URL: string;
  PUBLIC_KEY: string;
  MONGODB_URI: string;
  USER_SERVICE_URL: string;
  WAREHOUSE_SERVICE_URL?: string;
  PICKUP_SERVICE_URL?: string;
}

const configService = new ConfigService();
const configs: IAppConfig = {
  NODE_ENV: configService.get(`NODE_ENV`),
  PORT: configService.get(`PORT`),
  TZ: configService.get(`TZ`),
  ENCRYPT_KEY: configService.get(`ENCRYPT_KEY`),
  DATABASE_URL: configService.get(`DATABASE_URL`),
  PUBLIC_KEY: configService.get(`PUBLIC_KEY`),
  MONGODB_URI: configService.get(`MONGODB_URI`),
  USER_SERVICE_URL: configService.get(`USER_SERVICE_URL`),
};

const schema = Joi.object<IAppConfig>({
  NODE_ENV: Joi.string().valid('development', 'production', 'test', 'local').required(),
  PORT: Joi.number().optional(),
  TZ: Joi.string().optional(),
  ENCRYPT_KEY: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  PUBLIC_KEY: Joi.string().required(),
  MONGODB_URI: Joi.string().required(),
  USER_SERVICE_URL: Joi.string().required(),
});

export default registerAs('app_configs', () => {
  const { value, error } = schema.validate(configs, { abortEarly: false });

  if (error) {
    throw new Error(
      `Validation failed - Is there an environment variable missing? \n ${error.message.split('.').join('\n')}`,
    );
  }

  return value;
});
