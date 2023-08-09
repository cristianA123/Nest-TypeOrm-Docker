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

import { SourceService } from '../../services';
import { CreateSourceDto, UpdateSourceDto } from './../../dtos';

@ApiTags('Source')
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden, Token related' })
@Controller('source')
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 200,
    description: 'The Source has been successfully created.',
    type: CreateSourceDto,
  })
  create(@Body() createSourceDto: CreateSourceDto) {
    return this.sourceService.create(createSourceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all source' })
  @ApiResponse({ status: 200, description: 'List of Source' })
  @ApiResponse({ status: 404, description: 'List of Source is empty' })
  findAll() {
    return this.sourceService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Source with provided id has been successfully found.',
  })
  @ApiResponse({ status: 404, description: 'Source not found.' })
  findOne(@Param('id') id: string) {
    return this.sourceService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'The Source has been successfully updated.',
    type: UpdateSourceDto,
  })
  update(@Param('id') id: string, @Body() updateSourceDto: UpdateSourceDto) {
    return this.sourceService.update(+id, updateSourceDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.sourceService.remove(+id);
  }
}
