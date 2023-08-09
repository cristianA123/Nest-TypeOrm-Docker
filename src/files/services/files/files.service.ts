import { Injectable, ConflictException } from '@nestjs/common';
import * as sharp from 'sharp';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const DataURIParser = require('datauri/parser');

import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FolterTypeEnum } from '../../../constants';

@Injectable()
export class FilesService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}
  async uploadImage(file: Express.Multer.File, folderType: FolterTypeEnum) {
    const optimizedImage = await this._optimizeImage(file);

    const content = await this._bufferToBase64(
      file.originalname,
      optimizedImage,
    );
    const uniqueName = this._getUniqueName();

    return this.cloudinaryService.uploadFile(content, uniqueName, folderType);
  }

  async uploadImages(files: Express.Multer.File[], folderType: FolterTypeEnum) {
    const images = [];
    for (const file of files) {
      const optimizedImage = await this._optimizeImage(file);

      const content = await this._bufferToBase64(
        file.originalname,
        optimizedImage,
      );
      const uniqueName = this._getUniqueName();

      const image = await this.cloudinaryService.uploadFile(
        content,
        uniqueName,
        folderType,
      );
      images.push(image);
    }
    return images;
  }

  async deleteImage(publicId: string) {
    const rta = await this.cloudinaryService.deleteFile(publicId);
    if (rta.result !== 'ok') throw new ConflictException('File not deleted');
  }

  async deleteImages(publicIds: string[]) {
    const rta = await this.cloudinaryService.deleteFiles(publicIds);
    if (rta.length !== publicIds.length) {
      throw new ConflictException('Some files were not deleted');
    }
  }

  async updateImage(file: Express.Multer.File, publicId: string) {
    const optimizedImage = await this._optimizeImage(file);

    const content = await this._bufferToBase64(
      file.originalname,
      optimizedImage,
    );

    return this.cloudinaryService.updateFile(content, publicId);
  }

  private async _optimizeImage(file: Express.Multer.File): Promise<Buffer> {
    return sharp(file.buffer).resize(200, 200).toFormat('png').toBuffer();
  }

  private _getUniqueName(): string {
    const uuid = uuidv4();
    const uniqueId = `${uuid}-${format(new Date(), 'yyyyMMdd_HHmmss')}`;
    return `${uniqueId}`;
  }

  private async _bufferToBase64(
    originalName: string,
    buffer: Buffer,
  ): Promise<string> {
    const fileExtension = path.extname(originalName).toString();

    const parser = new DataURIParser();
    parser.format(fileExtension, buffer);
    if (!parser.content) throw new ConflictException('Invalid file');
    return parser.content;
  }
}
