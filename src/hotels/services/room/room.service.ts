import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource, In, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from '../../../database/entities/hotels/room.entity';
import { CreateRoomDto, UpdateRoomDto } from '../../dtos';
import { ImagesService } from '../../../files/services/images/images.service';
import { FilesService } from '../../../files/services/files/files.service';
import { FolterTypeEnum } from '../../../constants/folter_type.model';
import { Hotel, Quality, TypeRoom } from '../../../database/entities/hotels';
import {
  ResCreateRoomsDto,
  ResDeleteRoomsDto,
  ResGetRoomDto,
  ResGetRoomsDto,
  ResUpdateRoomsDto,
} from '../../dtos/room/response-room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private readonly _roomRepo: Repository<Room>,
    @InjectRepository(TypeRoom)
    private readonly _roomTypeRepo: Repository<TypeRoom>,
    @InjectRepository(Hotel) private readonly _hotelRepo: Repository<Hotel>,
    @InjectRepository(Quality)
    private readonly _qualityRepo: Repository<Quality>,
    private readonly _dataSource: DataSource,
    private readonly _imageService: ImagesService,
    private readonly _filesService: FilesService,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<ResCreateRoomsDto> {
    const {
      images,
      qualities,
      type: typeRoom,
      hotel: hotelName,
      ...roomData
    } = createRoomDto;
    console.log(createRoomDto);

    const type = await this._roomTypeRepo.findOne({
      where: { name: typeRoom },
    });

    if (!type) throw new BadRequestException('Type room not found');

    const hotel = await this._hotelRepo.findOne({
      where: { name: hotelName },
    });

    if (!hotel) throw new BadRequestException('Hotel not found');

    // validate if room name already exists in hotel

    const room = await this._roomRepo.findOne({
      where: { name: roomData.name, hotel },
    });

    if (room) throw new BadRequestException('Room already exists');

    // add qualities to room - find qualities in entity quality

    const qualitiesIdsNumber = qualities.split(',').map((quality) => +quality);
    console.log(qualitiesIdsNumber);

    const qualitiesData = await this._qualityRepo.find({
      // id: In(qualitiesIdsNumber),
      where: { id: In(qualitiesIdsNumber) },
      relations: ['image'],
    });
    console.log(qualitiesData);

    if (qualitiesData.length !== qualitiesIdsNumber.length)
      throw new BadRequestException('Quality not found');

    const newRoomData = this._roomRepo.create({
      ...roomData,
      type,
      hotel,
      qualities: qualitiesData,
    });

    const queryRunner = this._dataSource.createQueryRunner();

    const auxPublicIds: string[] = [];

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const roomId = await this._buildRoom(newRoomData, queryRunner);

      if (images && images.length) {
        const imagesIds = await this._imageService.createImagesForEntity(
          images.map((image, index) => ({
            file: image,
            name: roomData.name + index,
          })),
          queryRunner,
          FolterTypeEnum.ROOMS,
        );

        // auxPublicIds.push(...imagesData.map((image) => image));

        await queryRunner.manager
          .createQueryBuilder()
          .relation(Room, 'images')
          .of(roomId)
          .add(imagesIds);
      }

      await queryRunner.commitTransaction();

      const room = await this._roomRepo.findOne({
        where: { id: roomId },
        relations: ['images', 'qualities'],
      });
      // console.log(room);

      // update room with qualities

      const roomUpdated = await this._roomRepo.save({
        ...room,
        qualities: qualitiesData,
      });
      console.log(roomUpdated);

      return {
        ok: true,
        message: 'Room created successfully',
        room: {
          id: roomUpdated.id,
          name: roomUpdated.name,
          price: roomUpdated.price,
          available: roomUpdated.available,
          type: roomUpdated.type,
          qualities: roomUpdated.qualities.map((quality) => ({
            id: quality.id,
            name: quality.name,
            description: quality.description,
            image: {
              id: quality.image.id,
              name: quality.image.name,
              url: quality.image.secure_url,
            },
          })),
          images: roomUpdated.images.map((image) => ({
            id: image.id,
            name: image.name,
            url: image.secure_url,
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

  async findAll(): Promise<ResGetRoomsDto> {
    const rooms = await this._roomRepo.find({
      select: ['id', 'name', 'price', 'available', 'type'],
      relations: ['images', 'qualities', 'qualities.image'],
      // get image from quality
      // relations: ['images', 'qualities', 'qualities.image'],
    });
    // console.log(rooms);
    return {
      ok: true,
      message: 'Rooms retrieved successfully',
      rooms: rooms.map((room) => ({
        id: room.id,
        name: room.name,
        price: room.price,
        available: room.available,
        type: room.type,
        qualities: room.qualities
          ? room.qualities.map((quality) => ({
              id: quality.id,
              name: quality.name,
              description: quality.description,
              image: {
                id: quality.image.id,
                name: quality.image.name,
                url: quality.image.secure_url,
              },
            }))
          : [],
        images: room.images
          ? room.images.map((image) => ({
              id: image.id,
              name: image.name,
              url: image.secure_url,
            }))
          : [],
      })),
    };
  }

  async findOne(id: number): Promise<ResGetRoomDto> {
    try {
      const room = await this._roomRepo.findOne({
        where: { id },
        relations: ['images', 'qualities'],
      });
      return {
        ok: true,
        message: 'Room retrieved successfully',
        room: {
          id: room.id,
          name: room.name,
          price: room.price,
          available: room.available,
          type: room.type,
          qualities: room.qualities.map((quality) => ({
            id: quality.id,
            name: quality.name,
            description: quality.description,
            image: {
              id: quality.image.id,
              name: quality.image.name,
              url: quality.image.secure_url,
            },
          })),
          images: room.images.map((image) => ({
            id: image.id,
            name: image.name,
            url: image.secure_url,
          })),
        },
      };
    } catch (error) {
      console.log(error);
    }
  }

  // async update(
  //   id: number,
  //   updateRoomDto: UpdateRoomDto,
  // ): Promise<ResUpdateRoomsDto> {
  //   try {
  //     const room = await this.roomRepo.findOne({ where: { id } });
  //     if (!room) {
  //       throw new Error('Room not found');
  //     }
  //     await this.roomRepo.save({ ...room, ...updateRoomDto });
  //     return {
  //       ok: true,
  //       message: 'Room updated successfully',
  //       room: {
  //         id: room.id,
  //         name: room.name,
  //         price: room.price,
  //         available: room.available,
  //         type: room.type,
  //         qualities: room.qualities.map((quality) => ({
  //           id: quality.id,
  //           name: quality.name,
  //           description: quality.description,
  //           image: {
  //             id: quality.image.id,
  //             name: quality.image.name,
  //             url: quality.image.secure_url,
  //           },
  //         })),
  //         images: room.images.map((image) => ({
  //           id: image.id,
  //           name: image.name,
  //           url: image.secure_url,
  //         })),
  //       },
  //     };

  //     // return `This action updates a #${id} Room`;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async remove(id: number): Promise<ResDeleteRoomsDto> {
    try {
      const room = await this._roomRepo.findOne({ where: { id } });
      if (!Room) {
        throw new Error('Room not found');
      }
      await this._roomRepo.remove(room);
      return {
        ok: true,
        message: 'Room deleted successfully',
        room: {
          id: room.id,
          name: room.name,
          price: room.price,
          available: room.available,
          type: room.type,
          qualities: room.qualities.map((quality) => ({
            id: quality.id,
            name: quality.name,
            description: quality.description,
            image: {
              id: quality.image.id,
              name: quality.image.name,
              url: quality.image.secure_url,
            },
          })),
          images: room.images.map((image) => ({
            id: image.id,
            name: image.name,
            url: image.secure_url,
          })),
        },
      };
    } catch (error) {
      console.log(error);
    }
  }

  private async _buildRoom(
    room: Room,
    queryRunner: QueryRunner,
  ): Promise<number> {
    try {
      await queryRunner.startTransaction();

      // const { qualities, ...rest } = room;
      // const quialitiesIds = qualities.map((quality) => quality.id);

      const { identifiers } = await queryRunner.manager
        .createQueryBuilder(Room, 'room')
        .insert()
        .into(Room)
        .values({
          ...room,
        })
        .execute();

      await queryRunner.commitTransaction();

      return Number(identifiers[0].id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    }
  }
}
