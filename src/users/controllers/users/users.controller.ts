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
  UploadedFile,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { RoleEnum } from '../../../constants';
import { Roles } from '../../../auth/decorators';
import { RolesGuard, AccessTokenGuard } from '../../../auth/guards';
import { UsersService } from '../../services';
import { CreateUserDto, UpdateUserDto, UpdatedUserImageDto } from '../../dtos';
import {
  ResCreateUserDto,
  ResDeleteUserDto,
  ResGetUserDto,
  ResGetUsersDto,
  ResUpdateUserImageDto,
  ResUpdateUserDto,
} from '../../dtos/users/responses-user.dto';
import {
  FILE_TYPE,
  MAX_UPLOAD_SIZE,
  MaxFileSize,
  ValidFileTypes,
} from '../../../utils/helpers';

@ApiTags('Users')
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden, Token related' })
@ApiSecurity('access-token')
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of Users',
    type: ResGetUsersDto,
  })
  @ApiResponse({ status: 404, description: 'List of Users is empty' })
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  findAll() {
    return this._usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({
    status: 200,
    description: 'User with provided id has been successfully found.',
    type: ResGetUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this._usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 201,
    description: 'The User has been successfully created.',
    type: ResCreateUserDto,
  })
  @ApiBody({ type: CreateUserDto })
  @ApiConsumes('multipart/form-data')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @HttpCode(HttpStatus.CREATED)
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
    @Body() createUserDto: CreateUserDto,
  ) {
    return this._usersService.create({ image, ...createUserDto });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ResUpdateUserDto,
  })
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this._usersService.update(id, updateUserDto);
  }

  @Patch(':id/image')
  @ApiOperation({ summary: 'Update user image' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ResUpdateUserImageDto,
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
    @Body() updateUserImageDto: UpdatedUserImageDto,
  ) {
    return this._usersService.updateImage(id, { image, ...updateUserImageDto });
  }

  @Patch(':id/change-status')
  @ApiOperation({ summary: 'Change status of user' })
  @ApiResponse({
    status: 200,
    description: 'Change status of user successfully.',
  })
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  changeStatus(@Param('id', ParseIntPipe) id: number) {
    return this._usersService.changeStatus(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully deleted.',
    type: ResDeleteUserDto,
  })
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this._usersService.delete(id);
  }
}
