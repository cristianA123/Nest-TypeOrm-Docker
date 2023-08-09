import { Injectable, ConflictException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import {
  ResDeleteCloudinaryFileDto,
  ResDeleteCloudinaryFilesDto,
  CloudinaryImageStatusEnum,
} from '../../dtos';
import { FolterTypeEnum } from '../../../constants';

@Injectable()
export class CloudinaryService {
  async uploadFile(
    content: string,
    uniqueId: string,
    folderType: FolterTypeEnum,
  ) {
    const result = await cloudinary.uploader.upload(content, {
      folder: folderType,
      public_id: uniqueId,
      // * If the file is a buffer, we need to specify the resource_type
      //   resource_type: 'raw',
    });
    if (!result) throw new ConflictException('File not uploaded');

    // const publicId = result.public_id.split('/').pop();
    return { secureUrl: result.secure_url, publicId: result.public_id };
  }

  async updateFile(content: string, publicId: string) {
    const result = await cloudinary.uploader.upload(content, {
      public_id: publicId,
      overwrite: true,
    });
    if (!result) throw new ConflictException('File not updated');

    // const publicId = result.public_id.split('/').pop();
    return { secureUrl: result.secure_url, publicId: result.public_id };
  }

  async deleteFile(publicId: string) {
    const result: ResDeleteCloudinaryFileDto =
      await cloudinary.uploader.destroy(publicId);
    if (result.result !== 'ok') {
      throw new ConflictException('File not deleted: ' + publicId);
    }
    return result;
  }

  async deleteFiles(publicIds: string[]) {
    const result: ResDeleteCloudinaryFilesDto =
      await cloudinary.api.delete_resources(publicIds);

    // Separate the publicIds that were deleted from the publicIds that were not deleted
    const deletedPublicIds = [];
    const notDeletedPublicIds = [];

    for (const publicId in result.deleted) {
      if (result.deleted[publicId] === CloudinaryImageStatusEnum.DELETED) {
        deletedPublicIds.push(publicId);
      } else if (
        result.deleted[publicId] === CloudinaryImageStatusEnum.NOT_FOUND
      ) {
        notDeletedPublicIds.push(publicId);
      }
    }

    if (notDeletedPublicIds.length > 0) {
      throw new ConflictException('Files not deleted: ' + notDeletedPublicIds);
    }

    return deletedPublicIds;
  }
}
