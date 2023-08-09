import { Injectable } from '@nestjs/common';
import {
  CreateQualityDto,
  UpdateQualityDto,
} from '../../dtos/quality/actions-quality.dto';
import { Repository } from 'typeorm';
import { Source } from '../../../database/entities/users/source.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoomQualitiesDto } from 'src/hotels/dtos';

@Injectable()
export class RoomQualitiesService {
  constructor(
    @InjectRepository(Source) private sourceRepo: Repository<Source>,
  ) {}
  async create(createSourceDto: CreateRoomQualitiesDto) {
    try {
      const source = this.sourceRepo.create(createSourceDto);
      return this.sourceRepo.save(source);
    } catch (error) {
      console.log(error);
    }
  }

  findAll() {
    return this.sourceRepo.find();
  }

  async findOne(id: number) {
    try {
      return this.sourceRepo.findOne({ where: { id } });
    } catch (error) {
      console.log(error);
    }
  }

  async update(id: number, updateSourceDto: UpdateQualityDto) {
    try {
      const source = await this.sourceRepo.findOne({ where: { id } });
      if (!source) {
        throw new Error('Source not found');
      }
      return this.sourceRepo.save({ ...source, ...updateSourceDto });

      // return `This action updates a #${id} source`;
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: number) {
    try {
      const source = await this.sourceRepo.findOne({ where: { id } });
      if (!source) {
        throw new Error('Source not found');
      }
      return this.sourceRepo.remove(source);
    } catch (error) {
      console.log(error);
    }
  }
}
