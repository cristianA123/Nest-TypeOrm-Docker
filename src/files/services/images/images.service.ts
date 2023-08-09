import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';

import {
  CreateImageDto,
  ResCreateImageDto,
  ResDeleteImageDto,
  ResUpdateImageDto,
  UpdateImageDto,
  ResGetImageDto,
  ResGetImagesDto,
} from '../../dtos';
import { Image } from '../../../database/entities/common';
import { FilesService } from '../files/files.service';
import { FolterTypeEnum } from '../../../constants';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image) private readonly _imageRepo: Repository<Image>,
    private readonly _filesService: FilesService,
    private readonly _dataSource: DataSource,
  ) {}

  async findOne(id: number): Promise<ResGetImageDto> {
    const image = await this._imageRepo.findOne({ where: { id } });
    if (!image) throw new BadRequestException('Image not found');
    return {
      ok: true,
      message: 'Image retrieved successfully',
      image: {
        id: image.id,
        name: image.name,
        secure_url: image.secure_url,
        status: image.status,
      },
    };
  }

  async findAll(): Promise<ResGetImagesDto> {
    const images = await this._imageRepo.find({
      select: ['id', 'name', 'secure_url', 'status'],
    });

    return {
      ok: true,
      message: 'Images retrieved successfully',
      images: images.map((user) => ({
        id: user.id,
        name: user.name,
        secure_url: user.secure_url,
        status: user.status,
      })),
    };
  }

  async create(
    createImageDto: CreateImageDto,
  ): Promise<ResCreateImageDto | Image> {
    const { file, ...imageData } = createImageDto;

    const queryRunner = this._dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { secureUrl, publicId } = await this._filesService.uploadImage(
        file,
        FolterTypeEnum.TESTS,
      );

      const newImage = await queryRunner.manager.create(Image, {
        ...imageData,
        secure_url: secureUrl,
        public_id: publicId,
      });

      await queryRunner.commitTransaction();

      return {
        ok: true,
        message: 'Image created successfully',
        image: {
          id: newImage.id,
          name: newImage.name,
          secure_url: newImage.secure_url,
          status: newImage.status,
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException(error.message);
    }
  }

  async createImageForEntity(
    createImageDto: CreateImageDto,
    queryRunner: QueryRunner,
    folderType: FolterTypeEnum,
  ) {
    let auxPublicId = null;
    try {
      const { file, ...imageData } = createImageDto;

      await queryRunner.startTransaction();

      const { secureUrl, publicId } = await this._filesService.uploadImage(
        file,
        folderType,
      );
      auxPublicId = publicId;

      const { identifiers } = await queryRunner.manager.insert(Image, {
        ...imageData,
        secure_url: secureUrl,
        public_id: publicId,
      });

      await queryRunner.commitTransaction();

      return identifiers[0].id;
    } catch (error) {
      if (auxPublicId) await this._filesService.deleteImage(auxPublicId);
      await queryRunner.rollbackTransaction();
      throw new ConflictException(error.message);
    }
  }

  async createImagesForEntity(
    createImageDto: CreateImageDto[],
    queryRunner: QueryRunner,
    folderType: FolterTypeEnum,
  ): Promise<string[]> {
    const auxPublicIds = [];
    try {
      await queryRunner.startTransaction();

      const images = await Promise.all(
        createImageDto.map(async (image) => {
          const { file, ...imageData } = image;

          const { secureUrl, publicId } = await this._filesService.uploadImage(
            file,
            folderType,
          );
          auxPublicIds.push(publicId);

          return {
            ...imageData,
            secure_url: secureUrl,
            public_id: publicId,
          };
        }),
      );

      const { identifiers } = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Image)
        .values(images)
        .execute();

      await queryRunner.commitTransaction();

      return identifiers.map((image) => image.id);
    } catch (error) {
      if (auxPublicIds.length) {
        await this._filesService.deleteImages(auxPublicIds);
      }
      await queryRunner.rollbackTransaction();
      throw new ConflictException(error.message);
    }
  }

  async updatedImageForEntity(
    id: number,
    updateImageDto: UpdateImageDto,
    queryRunner: QueryRunner,
  ) {
    try {
      const image = await this._validateImage(id);

      const { file, ...updateImageData } = updateImageDto;

      await queryRunner.startTransaction();

      await queryRunner.manager
        .createQueryBuilder()
        .update(Image)
        .set({
          ...updateImageData,
        })
        .where('id = :id', { id });

      const { secureUrl, publicId } =
        file && (await this._filesService.updateImage(file, image.public_id));

      const updatedImage = await queryRunner.manager.preload(Image, {
        id,
        ...updateImageData,
        secure_url: secureUrl || image.secure_url,
        public_id: publicId || image.public_id,
      });

      await queryRunner.manager.save(updatedImage);

      await queryRunner.commitTransaction();

      return updatedImage;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException(error.message);
    }
  }

  async update(
    id: number,
    updateImageDto: UpdateImageDto,
  ): Promise<ResUpdateImageDto> {
    const image = await this._validateImage(id);

    const { file, ...updateImageData } = updateImageDto;

    const queryRunner = this._dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager
        .createQueryBuilder()
        .update(Image)
        .set({
          ...updateImageData,
        })
        .where('id = :id', { id });

      const { secureUrl, publicId } =
        file && (await this._filesService.updateImage(file, image.public_id));

      const updatedImage = await queryRunner.manager.preload(Image, {
        id,
        ...updateImageData,
        secure_url: secureUrl || image.secure_url,
        public_id: publicId || image.public_id,
      });

      await queryRunner.manager.save(updatedImage);

      await queryRunner.commitTransaction();

      return {
        ok: true,
        message: 'Image updated successfully',
        image: {
          id: updatedImage.id,
          name: updatedImage.name,
          secure_url: updatedImage.secure_url,
          status: updatedImage.status,
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException(error.message);
    }
  }

  async delete(id: number): Promise<ResDeleteImageDto> {
    const image = await this._validateImage(id);

    await this._imageRepo.delete(id);

    await this._filesService.deleteImage(image.public_id);

    return {
      ok: true,
      message: 'Image deleted successfully',
      image: {
        id: image.id,
        name: image.name,
        secure_url: image.secure_url,
        status: image.status,
      },
    };
  }

  async changeStatus(id: number): Promise<ResUpdateImageDto> {
    const image = await this._validateImage(id);

    const updatedImage = await this._imageRepo.save({
      ...image,
      status: !image.status,
    });

    return {
      ok: true,
      message: `Image ${
        updatedImage.status ? 'activated' : 'desactivated'
      } successfully`,
      image: {
        id: updatedImage.id,
        name: updatedImage.name,
        secure_url: updatedImage.secure_url,
        status: updatedImage.status,
      },
    };
  }

  private async _validateImage(id: number): Promise<Image> {
    const image = await this._imageRepo.findOne({ where: { id } });
    if (!image) throw new BadRequestException('Image not found');
    return image;
  }
}
