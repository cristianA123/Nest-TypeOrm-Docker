import {
  Body,
  Controller,
  Delete,
  Patch,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  Get,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { RoleEnum } from '../../../constants';
import { Roles } from '../../../auth/decorators';
import { RolesGuard, AccessTokenGuard } from '../../../auth/guards';
import { ImagesService } from './../../services';
import {
  ResCreateImageDto,
  ResUpdateImageDto,
  CreateImageDto,
  ResDeleteImageDto,
  UpdateImageDto,
  ResGetImagesDto,
  ResGetImageDto,
} from './../../dtos';
import {
  FILE_TYPE,
  MAX_UPLOAD_SIZE,
  MaxFileSize,
  ValidFileTypes,
} from '../../../utils/helpers';

@ApiTags('Images')
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden, Token related' })
@ApiSecurity('access-token')
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('images')
export class ImagesController {
  constructor(private readonly _imagesService: ImagesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Images' })
  @ApiResponse({
    status: 200,
    description: 'The records has been successfully retrieved.',
    type: ResGetImagesDto,
  })
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this._imagesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Image' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully retrieved.',
    type: ResGetImageDto,
  })
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this._imagesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create Image' })
  @ApiResponse({
    status: 201,
    description: 'The Image has been successfully created.',
    type: ResCreateImageDto,
  })
  @ApiBody({ type: CreateImageDto })
  @ApiConsumes('multipart/form-data')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile(
      /*  new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: FILE_TYPE,
        }) */
      /* .addMaxSizeValidator({
          maxSize: 1000,
        }) */
      new ParseFilePipeBuilder()
        .addValidator(new ValidFileTypes({ fileType: FILE_TYPE }))
        .addValidator(new MaxFileSize({ maxSize: MAX_UPLOAD_SIZE }))
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: true,
        }),
    )
    file: Express.Multer.File,
    @Body() createImageDto: CreateImageDto,
  ) {
    return this._imagesService.create({ file, ...createImageDto });
  }

  @Delete(':id')
  @ApiResponse({
    status: 204,
    description: 'The Image has been successfully deleted.',
    type: ResDeleteImageDto,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this._imagesService.delete(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Image' })
  @ApiResponse({
    status: 200,
    description: 'The Image has been successfully updated.',
    type: ResUpdateImageDto,
  })
  @ApiBody({ type: UpdateImageDto })
  @ApiConsumes('multipart/form-data')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  update(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(new ValidFileTypes({ fileType: FILE_TYPE }))
        .addValidator(new MaxFileSize({ maxSize: MAX_UPLOAD_SIZE }))
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    file: Express.Multer.File | undefined,
    @Body() updateImageDto: UpdateImageDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this._imagesService.update(id, { file, ...updateImageDto });
  }
}
