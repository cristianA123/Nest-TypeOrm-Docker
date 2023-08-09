import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateQualityDto,
  UpdateQualityDto,
  UpdatedQualityImageDto,
} from '../../dtos/quality/actions-quality.dto';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Quality } from '../../../database/entities/hotels/quality.entity';
import { ImagesService } from '../../../files/services/images/images.service';
import { FolterTypeEnum } from '../../../constants/folter_type.model';
import { FilesService } from '../../../files/services/files/files.service';
import {
  ResCreateQualitiesDto,
  ResDeleteQualitiesDto,
  ResGetQualitiesDto,
  ResGetQualityDto,
  ResUpdateQualitiesDto,
} from 'src/hotels/dtos/quality/response-quality.dto';

@Injectable()
export class QualityService {
  constructor(
    @InjectRepository(Quality) private qualityRepo: Repository<Quality>,
    private readonly _dataSource: DataSource,
    private readonly _imageService: ImagesService,
    private readonly _filesService: FilesService,
  ) {}

  async create(
    createQualityDto: CreateQualityDto,
  ): Promise<ResCreateQualitiesDto> {
    try {
      const { image } = createQualityDto;
      const quality = this.qualityRepo.create(createQualityDto);
      // await this.qualityRepo.save(quality);

      const queryRunner = this._dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const qualityId = await this._buildQuality(quality, queryRunner);

      console.log(quality);

      if (image) {
        const imageId = await this._imageService.createImageForEntity(
          { file: image, name: quality.name },
          queryRunner,
          FolterTypeEnum.QUALITIES,
        );
        // auxPublicId = imageId;

        await queryRunner.manager
          .createQueryBuilder()
          .relation(Quality, 'image')
          .of(qualityId)
          .set(imageId);
      }

      await queryRunner.commitTransaction();

      return {
        ok: true,
        message: 'Quality created successfully',
        quality: {
          id: quality.id,
          name: quality.name,
          description: quality.description,
          image: {
            id: quality.id,
            name: quality.name,
            url: quality.image.secure_url,
          },
        },
      };
    } catch (error) {
      console.log(error);
    }
  }

  private async _buildQuality(
    quality: Quality,
    queryRunner: QueryRunner,
  ): Promise<string> {
    try {
      await queryRunner.startTransaction();

      const { identifiers } = await queryRunner.manager
        .createQueryBuilder(Quality, 'quality')
        .insert()
        .into(Quality)
        .values({
          ...quality,
        })
        .execute();

      await queryRunner.commitTransaction();

      return identifiers[0].id;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<ResGetQualitiesDto> {
    const qualities = await this.qualityRepo.find({
      relations: ['image'],
    });
    return {
      ok: true,
      message: 'Qualities retrieved successfully',
      qualities: qualities.map((quality) => ({
        id: quality.id,
        name: quality.name,
        description: quality.description,
        image: {
          id: quality.image.id,
          name: quality.image.name,
          url: quality.image.secure_url,
        },
      })),
      // total: qualities.length,
    };
  }

  async findOne(id: number): Promise<ResGetQualityDto> {
    try {
      const quality = await this.qualityRepo.findOne({
        where: { id },
        relations: ['image'],
      });
      return {
        ok: true,
        message: 'Quality retrieved successfully',
        quality: {
          id: quality.id,
          name: quality.name,
          description: quality.description,
          image: {
            id: quality.image.id,
            name: quality.image.name,
            url: quality.image.secure_url,
          },
        },
      };
    } catch (error) {
      console.log(error);
    }
  }

  async update(
    id: number,
    updateQualityDto: UpdateQualityDto,
  ): Promise<ResUpdateQualitiesDto> {
    try {
      const quality = await this.qualityRepo.findOne({
        where: { id },
        relations: ['image'],
      });
      if (!quality) {
        throw new Error('Quality not found');
      }

      const qualityUpdated = await this.qualityRepo.save({
        ...quality,
        ...updateQualityDto,
      });

      // auxPublicId = imageId;
      return {
        ok: true,
        message: 'Quality updated successfully',
        quality: {
          id: qualityUpdated.id,
          name: qualityUpdated.name,
          description: qualityUpdated.description,
          image: {
            id: quality.image.id,
            name: quality.image.name,
            url: quality.image.secure_url,
          },
        },
      };

      // return `This action updates a #${id} source`;
    } catch (error) {
      console.log(error);
    }
  }

  async updateImage(
    id: number,
    { image }: UpdatedQualityImageDto,
  ): Promise<ResUpdateQualitiesDto> {
    try {
      const quality = await this.qualityRepo.findOne({ where: { id } });
      if (!quality) {
        throw new Error('Quality not found');
      }
      // await this.qualityRepo.save({ ...quality, ...updateQualityDto });

      const queryRunner = this._dataSource.createQueryRunner();

      let imageId = null;
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // const qualityId = await this._buildQuality(quality, queryRunner);

      console.log(quality);

      if (quality.image) {
        const { id } = await this._imageService.updatedImageForEntity(
          quality.image.id,
          { file: image, name: quality.name },
          queryRunner,
        );
        // auxPublicId = imageId;

        await queryRunner.manager
          .createQueryBuilder()
          .relation(Quality, 'image')
          .of(quality.id)
          .set(id);
      } else {
        const id = await this._imageService.createImageForEntity(
          { file: image, name: quality.name },
          queryRunner,
          FolterTypeEnum.USERS,
        );
        imageId = id;

        await queryRunner.manager
          .createQueryBuilder()
          .relation(Quality, 'image')
          .of(quality.id)
          .set(id);
      }

      await queryRunner.commitTransaction();
      const {
        image: { id: idImage, name, secure_url },
      } = await this._imageService.findOne(imageId);

      return {
        ok: true,
        message: 'Quality updated successfully',
        quality: {
          id: quality.id,
          name: quality.name,
          description: quality.description,
          image: {
            id: idImage,
            name: name,
            url: secure_url,
          },
        },
      };

      // return `This action updates a #${id} source`;
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: number): Promise<ResDeleteQualitiesDto> {
    try {
      const quality = await this.qualityRepo.findOne({
        where: { id },
        relations: ['image'],
      });
      if (!quality) {
        throw new Error('Quality not found');
      }
      await this.qualityRepo.remove(quality);
      await this._filesService.deleteImage(`${quality.image.id}`);
      return {
        ok: true,
        message: 'Quality deleted successfully',
        quality: {
          id: quality.id,
          name: quality.name,
          description: quality.description,
          image: {
            id: quality.image.id,
            name: quality.image.name,
            url: quality.image.secure_url,
          },
        },
      };
    } catch (error) {
      console.log(error);
    }
  }
}
