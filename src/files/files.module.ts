import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { ImagesController } from './controllers';
import { FilesService, ImagesService, CloudinaryService } from './services';
import { CloudinaryProvider } from './providers';

@Module({
  controllers: [ImagesController],
  exports: [ImagesService, FilesService],
  imports: [AuthModule],
  providers: [
    ImagesService,
    FilesService,
    CloudinaryProvider,
    CloudinaryService,
  ],
})
export class FilesModule {}
