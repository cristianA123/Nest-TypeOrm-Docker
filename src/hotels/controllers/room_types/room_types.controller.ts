import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

// import { QualityService } from '../../services';
import { RoomTypeService } from '../../services/room_types/room_types.service';
import { CreateRoomTypesDto } from '../../dtos/room_types/create-room_types.dto';
import { UpdateRoomTypesDto } from '../../dtos/room_types/update-room_types.dto';

@ApiTags('RoomType')
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden, Token related' })
@Controller('room-type')
export class RoomTypeController {
  constructor(private readonly roomTypeService: RoomTypeService) {}

  @Post()
  @ApiOperation({ summary: 'Create RoomType' })
  @ApiResponse({
    status: 200,
    description: 'The RoomType has been successfully created.',
    type: CreateRoomTypesDto,
  })
  @ApiBody({ type: CreateRoomTypesDto })
  create(@Body() createRoomTypeDto: CreateRoomTypesDto) {
    return this.roomTypeService.create(createRoomTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roomType' })
  @ApiResponse({ status: 200, description: 'List of RoomType' })
  @ApiResponse({ status: 404, description: 'List of RoomType is empty' })
  findAll() {
    return this.roomTypeService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'RoomType with provided id has been successfully found.',
  })
  @ApiResponse({ status: 404, description: 'RoomType not found.' })
  findOne(@Param('id') id: string) {
    return this.roomTypeService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'The RoomType has been successfully updated.',
    type: UpdateRoomTypesDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateRoomTypeDto: UpdateRoomTypesDto,
  ) {
    return this.roomTypeService.update(+id, updateRoomTypeDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.roomTypeService.remove(+id);
  }
}
