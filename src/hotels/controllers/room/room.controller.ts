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
  UploadedFiles,
  ParseFilePipeBuilder,
  HttpStatus,
  HttpCode,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { RoomService } from '../../services/room/room.service';
import { CreateRoomDto, UpdateRoomDto } from '../../dtos/room/action-room.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { RoleEnum } from '../../../constants/role.model';
import { AccessTokenGuard } from '../../../auth/guards/access-token.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { ResCreateRoomsDto } from '../../dtos/room/response-room.dto';
import { Public } from '../../../auth/decorators/public.decorator';
import {
  FILE_TYPE,
  MAX_UPLOAD_FILES,
  MAX_UPLOAD_SIZE,
  MaxFileSize,
  MaxQuantityFiles,
  ValidFileTypes,
} from '../../../utils/helpers';

@ApiTags('Rooms')
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden, Token related' })
@ApiSecurity('access-token')
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  @ApiOperation({ summary: 'Get all room' })
  @ApiResponse({ status: 200, description: 'List of room' })
  @ApiResponse({ status: 404, description: 'List of room is empty' })
  @Public()
  findAll() {
    return this.roomService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'room with provided id has been successfully found.',
  })
  @ApiResponse({ status: 404, description: 'room not found.' })
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create Room' })
  @ApiResponse({
    status: 200,
    description: 'The room has been successfully created.',
    type: ResCreateRoomsDto,
  })
  @ApiBody({ type: CreateRoomDto })
  @ApiConsumes('multipart/form-data')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @UseInterceptors(FilesInterceptor('images', MAX_UPLOAD_FILES))
  @HttpCode(HttpStatus.CREATED)
  create(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addValidator(new ValidFileTypes({ fileType: FILE_TYPE }))
        // .addValidator(new MaxQuantityFiles({ maxQuantity: MAX_UPLOAD_FILES }))
        .addValidator(new MaxFileSize({ maxSize: MAX_UPLOAD_SIZE }))
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    images: Express.Multer.File[],
    @Body() createRoomDto: CreateRoomDto,
  ) {
    // console.log(file);
    return this.roomService.create({ ...createRoomDto, images });
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'The room has been successfully updated.',
    type: UpdateRoomDto,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    // return this.roomService.update(+id, updateRoomDto);
    return;
  }

  @Delete(':id')
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully deleted.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roomService.remove(id);
  }
}
