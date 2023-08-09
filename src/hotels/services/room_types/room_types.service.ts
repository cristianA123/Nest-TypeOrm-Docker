import { Injectable } from '@nestjs/common';
import { CreateRoomTypesDto } from '../../dtos/room_types/create-room_types.dto';
import { UpdateRoomTypesDto } from '../../dtos/room_types/update-room_types.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeRoom } from '../../../database/entities/hotels/type_room.entity';
import {
  ResCreateTypeRoomsDto,
  ResDeleteTypeRoomsDto,
  ResGetTypeRoomsDto,
  ResGetTypeRoomDto,
  ResUpdateTypeRoomsDto,
} from 'src/hotels/dtos/room_types/response-room_types.dto';

@Injectable()
export class RoomTypeService {
  constructor(
    @InjectRepository(TypeRoom) private typeRoomRepo: Repository<TypeRoom>,
  ) {}

  async create(
    createTypeRoomDto: CreateRoomTypesDto,
  ): Promise<ResCreateTypeRoomsDto> {
    try {
      const typeRoom = this.typeRoomRepo.create(createTypeRoomDto);
      await this.typeRoomRepo.save(typeRoom);
      return {
        ok: true,
        message: 'TypeRoom created successfully',
        type_room: {
          id: typeRoom.id,
          name: typeRoom.name,
          description: typeRoom.description,
        },
      };
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(): Promise<ResGetTypeRoomsDto> {
    const type_rooms = await this.typeRoomRepo.find({
      select: ['id', 'name'],
    });
    return {
      ok: true,
      message: 'TypeRooms retrieved successfully',
      type_rooms: type_rooms.map((typeRoom) => ({
        id: typeRoom.id,
        name: typeRoom.name,
        description: typeRoom.description,
      })),
      // total: qualities.length,
    };
  }

  async findOne(id: number): Promise<ResGetTypeRoomDto> {
    try {
      const typeRoom = await this.typeRoomRepo.findOne({
        where: { id },
        relations: ['image'],
      });
      return {
        ok: true,
        message: 'TypeRoom retrieved successfully',
        type_room: {
          id: typeRoom.id,
          name: typeRoom.name,
          description: typeRoom.description,
        },
      };
    } catch (error) {
      console.log(error);
    }
  }

  async update(
    id: number,
    updateTypeRoomDto: UpdateRoomTypesDto,
  ): Promise<ResUpdateTypeRoomsDto> {
    try {
      const typeRoom = await this.typeRoomRepo.findOne({ where: { id } });
      if (!typeRoom) {
        throw new Error('TypeRoom not found');
      }
      await this.typeRoomRepo.save({ ...typeRoom, ...updateTypeRoomDto });
      return {
        ok: true,
        message: 'TypeRoom updated successfully',
        type_room: {
          id: typeRoom.id,
          name: typeRoom.name,
          description: typeRoom.description,
        },
      };

      // return `This action updates a #${id} source`;
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: number): Promise<ResDeleteTypeRoomsDto> {
    try {
      const typeRoom = await this.typeRoomRepo.findOne({ where: { id } });
      if (!typeRoom) {
        throw new Error('TypeRoom not found');
      }
      await this.typeRoomRepo.remove(typeRoom);
      return {
        ok: true,
        message: 'TypeRoom deleted successfully',
        type_room: {
          id: typeRoom.id,
          name: typeRoom.name,
          description: typeRoom.description,
        },
      };
    } catch (error) {
      console.log(error);
    }
  }
}
