import { Module } from '@nestjs/common';

import { SourceService, UsersService } from './services';
import { AuthModule } from '../auth/auth.module';
import {
  UsersController,
  SourceController,
  RolesController,
} from './controllers';
import { FilesModule } from '../files/files.module';

@Module({
  controllers: [UsersController, RolesController, SourceController],
  exports: [],
  imports: [AuthModule, FilesModule],
  providers: [UsersService, SourceService],
})
export class UsersModule {}
