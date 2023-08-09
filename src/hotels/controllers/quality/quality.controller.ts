import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  ParseIntPipe,
  UseInterceptors,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { QualityService } from '../../services';
import { CreateQualityDto, UpdateQualityDto } from '../../dtos';
import {
  ValidFileTypes,
  MaxFileSize,
  FILE_TYPE,
  MAX_UPLOAD_SIZE,
} from '../../../utils/helpers/multer.helper';
import { ResUpdateQualitiesDto } from 'src/hotels/dtos/quality/response-quality.dto';
import { RoleEnum } from 'src/constants';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { UpdatedQualityImageDto } from '../../dtos/quality/actions-quality.dto';

@ApiTags('Quality')
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden, Token related' })
@Controller('quality')
export class QualityController {
  constructor(private readonly qualityService: QualityService) {}

  @Post()
  @ApiOperation({ summary: 'Create Quality' })
  @ApiResponse({
    status: 200,
    description: 'The Quality has been successfully created.',
    type: CreateQualityDto,
  })
  @ApiBody({ type: CreateQualityDto })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  create(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(new ValidFileTypes({ fileType: FILE_TYPE }))
        .addValidator(new MaxFileSize({ maxSize: MAX_UPLOAD_SIZE }))
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    image: Express.Multer.File,
    @Body() createQualityDto: CreateQualityDto,
  ) {
    console.log(image);
    return this.qualityService.create({ image, ...createQualityDto });
  }

  @Get()
  @ApiOperation({ summary: 'Get all quality' })
  @ApiResponse({ status: 200, description: 'List of Quality' })
  @ApiResponse({ status: 404, description: 'List of Quality is empty' })
  findAll() {
    return this.qualityService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Quality with provided id has been successfully found.',
  })
  @ApiResponse({ status: 404, description: 'Quality not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.qualityService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update quality' })
  @ApiResponse({
    status: 200,
    description: 'The Quality has been successfully updated.',
    type: UpdateQualityDto,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSourceDto: UpdateQualityDto,
  ) {
    return this.qualityService.update(+id, updateSourceDto);
  }

  @Patch(':id/image')
  @ApiOperation({ summary: 'Update quality image' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ResUpdateQualitiesDto,
  })
  @ApiConsumes('multipart/form-data')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  updateImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(new ValidFileTypes({ fileType: FILE_TYPE }))
        .addValidator(new MaxFileSize({ maxSize: MAX_UPLOAD_SIZE }))
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    image: Express.Multer.File,
    @Body() updateUserImageDto: UpdatedQualityImageDto,
  ) {
    return this.qualityService.updateImage(id, {
      image,
      ...updateUserImageDto,
    });
  }

  @Delete(':id')
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully deleted.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.qualityService.remove(+id);
  }
}
