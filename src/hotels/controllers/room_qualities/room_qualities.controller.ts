import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RoomQualitiesService } from '../../services';
import { CreateRoomQualitiesDto, UpdateRoomQualitiesDto } from '../../dtos';

@ApiTags('Source')
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden, Token related' })
@Controller('source')
export class RoomQualitiesController {
  constructor(private readonly roomQualityService: RoomQualitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 200,
    description: 'The Source has been successfully created.',
    type: CreateRoomQualitiesDto,
  })
  create(@Body() createRoomQualitiesDto: CreateRoomQualitiesDto) {
    return this.roomQualityService.create(createRoomQualitiesDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all source' })
  @ApiResponse({ status: 200, description: 'List of Source' })
  @ApiResponse({ status: 404, description: 'List of Source is empty' })
  findAll() {
    return this.roomQualityService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Source with provided id has been successfully found.',
  })
  @ApiResponse({ status: 404, description: 'Source not found.' })
  findOne(@Param('id') id: string) {
    return this.roomQualityService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'The Source has been successfully updated.',
    type: UpdateRoomQualitiesDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateSourceDto: UpdateRoomQualitiesDto,
  ) {
    return this.roomQualityService.update(+id, updateSourceDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.roomQualityService.remove(+id);
  }
}
