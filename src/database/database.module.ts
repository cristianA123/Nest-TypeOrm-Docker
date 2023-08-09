import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getTypeOrmModuleOptions } from './data-source';
import { Role, Source, User } from './entities/users';
import {
  Country,
  City,
  Hotel,
  TypeRoom,
  Room,
  Quality,
} from './entities/hotels';
import { Image } from './entities/common';
import config from '../config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: async ({ postgres }: ConfigType<typeof config>) => ({
        ...getTypeOrmModuleOptions(),
      }),
    }),
    TypeOrmModule.forFeature([
      User,
      Source,
      Role,
      Country,
      City,
      Hotel,
      TypeRoom,
      Room,
      Image,
      Quality,
    ]),
  ],
  exports: [TypeOrmModule],
})
@Global()
export class DatabaseModule {}
