import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import * as Joi from 'joi';

import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/user.module';
import { HealthModule } from './health/health.module';
import { HotelsModule } from './hotels/hotels.module';
import { FilesModule } from './files/files.module';
import config from './config';
import { getEnvPath } from './utils/helpers';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvPath(`${__dirname}/utils/envs`),
      isGlobal: true,
      load: [config],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().optional().default(3000),
        // * Database - Postgres
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_HOST: Joi.string().hostname().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_DB: Joi.string().required(),
        // * Hash - Bycrypt
        BYCRYPT_SALT: Joi.number().required(),
        // * Token - JWT
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        ACCESS_TOKEN_EXPIRATION: Joi.string().required(),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_EXPIRATION: Joi.string().required(),
        RECOVERY_TOKEN_SECRET: Joi.string().required(),
        RECOVERY_TOKEN_EXPIRATION: Joi.string().required(),
        // * OAuth2 - Google
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_SECRET: Joi.string().required(),
        GOOGLE_CALLBACK_URL: Joi.string().required(),
        GOOGLE_ACCESS_TYPE: Joi.string().required(),
        // * Files - Cloudinary
        CLOUDINARY_NAME: Joi.string().required(),
        CLOUDINARY_API_KEY: Joi.string().required(),
        CLOUDINARY_API_SECRET: Joi.string().required(),
      }),
    }),
    AuthModule,
    DatabaseModule,
    UsersModule,
    HealthModule,
    HotelsModule,
    FilesModule,
  ],
  controllers: [],
  /* providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ], */
})
export class AppModule {}
