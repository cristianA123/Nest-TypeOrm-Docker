import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import InitSeeder from './seeds/init.seed';

export const getTypeOrmModuleOptions = (): TypeOrmModuleOptions => {
  const dbOptions = {
    synchronize: false,
    logging: true,
    autoLoadEntities: true,
    entities: [
      ['development', 'production'].includes(process.env.NODE_ENV)
        ? join(__dirname, '../../dist/database/entities/**/*.entity{.ts,.js}')
        : join(__dirname, '../../src/database/entities/**/*.entity{.ts,.js}'),
    ],
  };

  Object.assign(dbOptions, {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    database: process.env.POSTGRES_DB || 'hotel_db',
    username: process.env.POSTGRES_USER || 'root',
    password: process.env.POSTGRES_PASSWORD || 'admin',
  });

  return dbOptions;
};

export const getDataSourceOptions = (): DataSourceOptions => {
  const options: DataSourceOptions = {
    ...getTypeOrmModuleOptions(),
  } as DataSourceOptions;

  Object.assign(options, {
    migrationsTableName: 'migrations',
    migrations: [
      ['development', 'production'].includes(process.env.NODE_ENV)
        ? join(__dirname, '../../dist/database/migrations/*.js')
        : join(__dirname, '../../src/database/migrations/*.ts'),
    ],
    seeds: [InitSeeder],
  } as Partial<DataSourceOptions>);

  console.log(options);
  return options;
};
export default new DataSource(getDataSourceOptions());
