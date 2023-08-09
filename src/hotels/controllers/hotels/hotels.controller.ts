import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  UploadedFiles,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

import { RoleEnum } from '../../../constants';
import { Roles } from '../../../auth/decorators';
import { RolesGuard, AccessTokenGuard } from '../../../auth/guards';
import { HotelsService } from '../../services';
import { CreateHotelsDto, UpdateHotelsDto } from '../../dtos';
import {
  ResCreateHotelDto,
  ResDeleteHotelDto,
  ResGetHotelDto,
  ResGetHotelsDto,
  ResUpdateHotelDto,
} from '../../dtos/hotels/responses-hotels.dto';
import {
  FILE_TYPE,
  MAX_UPLOAD_FILES,
  MAX_UPLOAD_SIZE,
  MaxFileSize,
  MaxQuantityFiles,
  ValidFileTypes,
} from '../../../utils/helpers';
@ApiTags('Hotels')
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden, Token related' })
@ApiSecurity('access-token')
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('hotels')
export class HotelsController {
  constructor(private readonly _hotelsService: HotelsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all hotels' })
  @ApiResponse({
    status: 200,
    description: 'List of Hotels',
    type: ResGetHotelsDto,
  })
  @ApiResponse({ status: 404, description: 'List of Hotels is empty' })
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  findAll() {
    return this._hotelsService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Hotel with provided id has been successfully found.',
    type: ResGetHotelDto,
  })
  @ApiResponse({ status: 404, description: 'Hotel not found.' })
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this._hotelsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create hotel' })
  @ApiResponse({
    status: 201,
    description: 'The Hotel has been successfully created.',
    type: ResCreateHotelDto,
  })
  @ApiBody({ type: CreateHotelsDto })
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
    @Body() createHotelDto: CreateHotelsDto,
  ) {
    console.log('images', images);
    return this._hotelsService.create({ ...createHotelDto, images });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update hotel' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ResUpdateHotelDto,
  })
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHotelDto: UpdateHotelsDto,
  ) {
    return this._hotelsService.update(id, updateHotelDto);
  }

  @Patch(':id/change-status')
  @ApiOperation({ summary: 'Change status of hotel' })
  @ApiResponse({
    status: 200,
    description: 'Change status of hotel successfully.',
  })
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  changeStatus(@Param('id', ParseIntPipe) id: number) {
    return this._hotelsService.changeStatus(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete hotel' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully deleted.',
    type: ResDeleteHotelDto,
  })
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this._hotelsService.delete(id);
  }
}
