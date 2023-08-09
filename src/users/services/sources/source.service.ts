import { Injectable } from '@nestjs/common';
import { CreateSourceDto } from '../../dtos/sources/create-source.dto';
import { UpdateSourceDto } from '../../dtos/sources/update-source.dto';
import { Repository } from 'typeorm';
import { Source } from '../../../database/entities/users/source.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SourceService {
  constructor(
    @InjectRepository(Source) private sourceRepo: Repository<Source>,
  ) {}
  async create(createSourceDto: CreateSourceDto) {
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

  async update(id: number, updateSourceDto: UpdateSourceDto) {
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
