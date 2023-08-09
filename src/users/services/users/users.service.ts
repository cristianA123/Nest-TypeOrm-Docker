import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';

import { CreateUserDto, UpdateUserDto } from '../../dtos';
import { Role, Source, User } from '../../../database/entities/users';
import { FolterTypeEnum, RoleEnum, SourceEnum } from '../../../constants';
import {
  ResCreateUserDto,
  ResDeleteUserDto,
  ResGetUsersDto,
  ResUpdateUserDto,
  ResGetUserDto,
  UpdatedUserImageDto,
  ResUpdateUserImageDto,
} from '../../dtos';
import { FilesService, ImagesService } from '../../../files/services';
import { AuthService } from '../../../auth/services/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    @InjectRepository(Source) private readonly sourceRepo: Repository<Source>,
    private readonly _dataSource: DataSource,
    private readonly _authService: AuthService,
    private readonly _imageService: ImagesService,
    private readonly _filesService: FilesService,
  ) {}

  async findOne(id: number): Promise<ResGetUserDto> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['image'],
    });
    if (!user) throw new BadRequestException('User not found');
    return {
      ok: true,
      message: 'User retrieved successfully',
      user: {
        id: user.id,
        name: user.firstName,
        email: user.email,
        image: user.image.secure_url,
        status: user.status,
      },
    };
  }

  async findAll(): Promise<ResGetUsersDto> {
    const users = await this.userRepo.find({
      select: ['id', 'firstName', 'lastName', 'email', 'status'],
    });

    return {
      ok: true,
      message: 'Users retrieved successfully',
      users: users.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.firstName,
        status: user.status,
      })),
    };
  }

  async create(createUserDto: CreateUserDto): Promise<ResCreateUserDto> {
    const {
      password,
      role: userRole,
      source: userSource,
      image,
      ...userData
    } = createUserDto;

    const isValidEmail = await this._existsUser(userData.email);
    if (isValidEmail) throw new ConflictException('Email already exists');

    const role = await this.roleRepo.findOne({
      where: { name: userRole || RoleEnum.USER },
    });
    if (!role) throw new ConflictException('Role not found');

    const source = await this.sourceRepo.findOne({
      where: { name: userSource || SourceEnum.EMAIL },
    });
    if (!source) throw new ConflictException('Source not found');

    const newUserData = this.userRepo.create({
      ...userData,
      password: await this._authService.hashData(password),
      role,
      source,
    });

    const queryRunner = this._dataSource.createQueryRunner();

    let auxPublicId = null;
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const userId = await this._buildUser(newUserData, queryRunner);

      if (image) {
        const imageId = await this._imageService.createImageForEntity(
          { file: image, name: userData.firstName + ' ' + userData.lastName },
          queryRunner,
          FolterTypeEnum.USERS,
        );
        auxPublicId = imageId;

        await queryRunner.manager
          .createQueryBuilder()
          .relation(User, 'image')
          .of(userId)
          .set(imageId);
      }

      await queryRunner.commitTransaction();

      return {
        ok: true,
        message: 'User created successfully',
        user: {
          id: Number(userId),
          name: userData.firstName,
          email: userData.email,
        },
      };
    } catch (error) {
      if (auxPublicId) await this._filesService.deleteImage(auxPublicId);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<ResUpdateUserDto> {
    const { role: userRole, source: userSource, ...userData } = updateUserDto;

    const user = await this._validateUser(id);

    if (userRole) {
      const role = await this.roleRepo.findOne({
        where: { name: userRole },
      });
      if (!role) throw new ConflictException('Role not found');
      user.role = role;
    }

    if (userSource) {
      const source = await this.sourceRepo.findOne({
        where: { name: userSource },
      });
      if (!source) throw new ConflictException('Source not found');
      user.source = source;
    }

    const updatedUser = await this.userRepo.save({
      ...user,
      ...userData,
    });

    return {
      ok: true,
      message: 'User updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.firstName,
        email: updatedUser.email,
      },
    };
  }

  async updateImage(
    id: number,
    { image }: UpdatedUserImageDto,
  ): Promise<ResUpdateUserImageDto> {
    const user = await this._validateUser(id);

    const queryRunner = this._dataSource.createQueryRunner();

    let imageId = null;
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      if (user.image) {
        const { id } = await this._imageService.updatedImageForEntity(
          user.image.id,
          { file: image, name: user.firstName + ' ' + user.lastName },
          queryRunner,
        );
        imageId = id;

        await queryRunner.manager
          .createQueryBuilder()
          .relation(User, 'image')
          .of(user.id)
          .set(id);
      } else {
        const id = await this._imageService.createImageForEntity(
          { file: image, name: user.firstName + ' ' + user.lastName },
          queryRunner,
          FolterTypeEnum.USERS,
        );
        imageId = id;

        await queryRunner.manager
          .createQueryBuilder()
          .relation(User, 'image')
          .of(user.id)
          .set(id);
      }

      await queryRunner.commitTransaction();

      const {
        image: { id, name, secure_url },
      } = await this._imageService.findOne(imageId);

      return {
        ok: true,
        message: 'User image updated successfully',
        image: {
          id,
          name,
          secure_url,
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: number): Promise<ResDeleteUserDto> {
    const user = await this._validateUser(id);

    await this.userRepo.delete(id);

    await this._filesService.deleteImage(user.image.public_id);

    return {
      ok: true,
      message: 'User deleted successfully',
      user: {
        id: user.id,
        name: user.firstName,
        email: user.email,
      },
    };
  }

  async changeStatus(id: number): Promise<ResUpdateUserDto> {
    const user = await this._validateUser(id);

    const updatedUser = await this.userRepo.save({
      ...user,
      status: !user.status,
    });

    return {
      ok: true,
      message: `User ${
        updatedUser.status ? 'activated' : 'deactivated'
      } successfully`,
      user: {
        id: updatedUser.id,
        name: updatedUser.firstName,
        email: updatedUser.email,
      },
    };
  }

  private async _buildUser(
    user: User,
    queryRunner: QueryRunner,
  ): Promise<string> {
    try {
      await queryRunner.startTransaction();

      const { identifiers } = await queryRunner.manager
        .createQueryBuilder(User, 'user')
        .insert()
        .into(User)
        .values({
          ...user,
        })
        .execute();

      await queryRunner.commitTransaction();

      return identifiers[0].id;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    }
  }

  private async _validateUser(id: number): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['role', 'source', 'image'],
    });
    if (!user) throw new BadRequestException('User not found');
    return user;
  }

  private async _existsUser(email: string): Promise<boolean> {
    const user = await this.userRepo.findOne({ where: { email } });
    return !!user;
  }
}
