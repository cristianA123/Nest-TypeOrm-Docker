import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository, DataSource } from 'typeorm';

import {
  CreateHotelsDto,
  ResGetHotelDto,
  ResGetHotelsDto,
  ResCreateHotelDto,
  ResUpdateHotelDto,
  ResDeleteHotelDto,
  UpdateHotelsDto,
} from '../../dtos';
import { City, Hotel } from '../../../database/entities/hotels';
import { Image } from '../../../database/entities/common/image.entity';
import { ImagesService, FilesService } from '../../../files/services';
import { FolterTypeEnum } from '../../../constants/folter_type.model';

@Injectable()
export class HotelsService {
  constructor(
    @InjectRepository(Hotel) private readonly _hotelRepo: Repository<Hotel>,
    @InjectRepository(City) private readonly _cityRepo: Repository<City>,
    private readonly _dataSource: DataSource,
    private readonly _imageService: ImagesService,
    private readonly _filesService: FilesService,
  ) {}

  async findOne(id: number): Promise<ResGetHotelDto> {
    const hotel = await this._hotelRepo.findOne({
      where: { id },
      relations: ['images', 'city'],
    });
    if (!hotel) throw new BadRequestException('Hotel not found');
    console.log(
      '🚀 ~ file: hotels.service.ts:40 ~ HotelsService ~ findOne ~ hotel:',
      hotel,
    );

    return {
      ok: true,
      message: 'User retrieved successfully',
      hotel: {
        id: hotel.id,
        name: hotel.name,
        description: hotel.description,
        email: hotel.email,
        address: hotel.address,
        rating: hotel.rating,
        city: {
          id: hotel.city.id,
          name: hotel.city.name,
        },
        images: hotel.images.map((image) => ({
          id: image.id,
          secure_url: image.secure_url,
          name: image.name,
        })),
      },
    };
  }

  async findAll(): Promise<ResGetHotelsDto> {
    const hotels = await this._hotelRepo.find({
      relations: ['city', 'images'],
    });

    if (!hotels.length) throw new BadRequestException('Hotels not found');

    return {
      ok: true,
      message: 'Hotels retrieved successfully',
      hotels: hotels.map((hotel) => ({
        id: hotel.id,
        name: hotel.name,
        description: hotel.description,
        email: hotel.email,
        address: hotel.address,
        rating: hotel.rating,
        city: {
          id: hotel.city.id,
          name: hotel.city.name,
        },
        images: hotel.images.map((image) => ({
          id: image.id,
          secure_url: image.secure_url,
          name: image.name,
        })),
      })),
    };
  }

  async create(CreateHotelsDto: CreateHotelsDto): Promise<ResCreateHotelDto> {
    const { images, city: hotelCity, ...hotelData } = CreateHotelsDto;

    const isValidEmail = await this._existsHotel(hotelData.email);
    if (isValidEmail) throw new ConflictException('Email already exists');

    const city = await this._cityRepo.findOne({
      where: { name: hotelCity },
    });
    if (!city) throw new ConflictException('City not found');

    const newHotelData = this._hotelRepo.create({
      ...hotelData,
      city,
    });

    const queryRunner = this._dataSource.createQueryRunner();

    const auxPublicIds: string[] = [];
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const hotelId = await this._buildHotel(newHotelData, queryRunner);

      if (images && images.length) {
        const imagesIds = await this._imageService.createImagesForEntity(
          images.map((image, index) => ({
            file: image,
            name: hotelData.name + index,
          })),
          queryRunner,
          FolterTypeEnum.HOTELS,
        );
        console.log(imagesIds);
        await queryRunner.manager
          .createQueryBuilder()
          .relation(Hotel, 'images')
          .of(hotelId)
          .add(imagesIds);
      }

      await queryRunner.commitTransaction();

      const hotel = await this._hotelRepo.findOne({
        where: { id: hotelId },
        relations: ['city', 'images'],
      });

      return {
        ok: true,
        message: 'Hotel created successfully',
        hotel: {
          id: hotel.id,
          name: hotel.name,
          description: hotel.description,
          email: hotel.email,
          address: hotel.address,
          rating: hotel.rating,
          city: {
            id: hotel.city.id,
            name: hotel.city.name,
          },
          images: hotel.images.map((image) => ({
            id: image.id,
            secure_url: image.secure_url,
            name: image.name,
          })),
        },
      };
    } catch (error) {
      if (auxPublicIds.length) {
        await this._filesService.deleteImages(auxPublicIds);
      }
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    id: number,
    updateHotelDto: UpdateHotelsDto,
  ): Promise<ResUpdateHotelDto> {
    const { city: cityHotel, ...hotelData } = updateHotelDto;

    const hotel = await this._validateHotel(id);

    if (cityHotel) {
      const city = await this._cityRepo.findOne({
        where: { name: cityHotel },
      });
      if (!city) throw new ConflictException('City not found');
      hotel.city = city;
    }

    const updatedHotel = await this._hotelRepo.save({
      ...hotel,
      ...hotelData,
    });

    return {
      ok: true,
      message: 'Hotel updated successfully',
      hotel: {
        id: updatedHotel.id,
        name: updatedHotel.name,
        description: updatedHotel.description,
        email: updatedHotel.email,
        address: updatedHotel.address,
        rating: updatedHotel.rating,
        city: {
          id: updatedHotel.city.id,
          name: updatedHotel.city.name,
        },
        images: updatedHotel.images.map((image) => ({
          id: image.id,
          secure_url: image.secure_url,
          name: image.name,
        })),
      },
    };
  }

  /* async updateImage(
    id: number,
    { image }: UpdatedUserImageDto,
  ): Promise<ResUpdateUserImageDto> {
    const user = await this._validateUser(id);

    const queryRunner = this._dataSource.createQueryRunner();

    let imageId = null;
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      if (user.image) {
        const { id } = await this._imageService.updatedImageForEntity(
          user.image.id,
          { file: image, name: user.firstName + ' ' + user.lastName },
          queryRunner,
        );
        imageId = id;

        await queryRunner.manager
          .createQueryBuilder()
          .relation(User, 'image')
          .of(user.id)
          .set(id);
      } else {
        const id = await this._imageService.createImageForEntity(
          { file: image, name: user.firstName + ' ' + user.lastName },
          queryRunner,
          FolterTypeEnum.USERS,
        );
        imageId = id;

        await queryRunner.manager
          .createQueryBuilder()
          .relation(User, 'image')
          .of(user.id)
          .set(id);
      }

      await queryRunner.commitTransaction();

      const {
        image: { id, name, secure_url },
      } = await this._imageService.findOne(imageId);

      return {
        ok: true,
        message: 'User image updated successfully',
        image: {
          id,
          name,
          secure_url,
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  } */

  async delete(id: number): Promise<ResDeleteHotelDto> {
    const hotel = await this._validateHotel(id);

    await this._hotelRepo.delete(id);

    if (hotel.images && hotel.images.length) {
      await this._filesService.deleteImages(
        hotel.images.map((image) => image.public_id),
      );
    }

    return {
      ok: true,
      message: 'Hotel deleted successfully',
      hotel: {
        id: hotel.id,
        name: hotel.name,
        description: hotel.description,
        email: hotel.email,
        address: hotel.address,
        rating: hotel.rating,
        city: {
          id: hotel.city.id,
          name: hotel.city.name,
        },
        images: hotel.images.map((image) => ({
          id: image.id,
          secure_url: image.secure_url,
          name: image.name,
        })),
      },
    };
  }

  async changeStatus(id: number): Promise<ResUpdateHotelDto> {
    const hotel = await this._validateHotel(id);

    const updatedHotel = await this._hotelRepo.save({
      ...hotel,
      status: !hotel.status,
    });

    return {
      ok: true,
      message: `Hotel ${
        updatedHotel.status ? 'activated' : 'deactivated'
      } successfully`,
      hotel: {
        id: updatedHotel.id,
        name: updatedHotel.name,
        description: updatedHotel.description,
        email: updatedHotel.email,
        address: updatedHotel.address,
        rating: updatedHotel.rating,
        city: {
          id: updatedHotel.city.id,
          name: updatedHotel.city.name,
        },
        images: updatedHotel.images.map((image) => ({
          id: image.id,
          secure_url: image.secure_url,
          name: image.name,
        })),
      },
    };
  }

  private async _buildHotel(
    hotel: Hotel,
    queryRunner: QueryRunner,
  ): Promise<number> {
    try {
      await queryRunner.startTransaction();

      const { identifiers } = await queryRunner.manager
        .createQueryBuilder(Hotel, 'hotel')
        .insert()
        .into(Hotel)
        .values({
          ...hotel,
        })
        .execute();

      await queryRunner.commitTransaction();

      return Number(identifiers[0].id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    }
  }

  private async _validateHotel(id: number): Promise<Hotel> {
    const hotel = await this._hotelRepo.findOne({
      where: { id },
      relations: ['city', 'images'],
    });
    if (!hotel) throw new NotFoundException('Hotel not found');
    return hotel;
  }

  private async _existsHotel(email: string): Promise<boolean> {
    const hotel = await this._hotelRepo.findOne({ where: { email } });
    return !!hotel;
  }
}
