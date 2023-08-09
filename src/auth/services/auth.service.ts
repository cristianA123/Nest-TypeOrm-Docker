import {
  Inject,
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigType } from '@nestjs/config';

import { RoleEnum, SourceEnum } from '../../constants';
import { User, Role, Source } from '../../database/entities/users';
import {
  LoginAuthDto,
  ResLogOutnDto,
  ResLoginDto,
  ResRefreshDto,
  SignupUserDto,
} from '../dtos';
import { PayloadToken } from '../interfaces';
import config from '../../config';
import { CreateUserGoogleDto } from '../../users/dtos/users/actions-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(config.KEY) private _configService: ConfigType<typeof config>,
    @InjectRepository(User) private readonly _userRepo: Repository<User>,
    @InjectRepository(Role) private readonly _roleRepo: Repository<Role>,
    @InjectRepository(Source) private readonly _sourceRepo: Repository<Source>,
    private readonly jwtService: JwtService,
  ) {}

  async validateRoleInUser(user: PayloadToken, roles: RoleEnum[]) {
    const userRole = await this._userRepo.findOne({
      where: { id: user.sub },
      relations: ['role'],
    });
    if (!userRole) throw new UnauthorizedException('Invalid credentials');

    const role = userRole.role.name;
    if (!roles.includes(role as RoleEnum)) {
      throw new ConflictException('Your role is wrong');
    }

    return true;
  }

  async signupLocal(signupLocalDto: SignupUserDto): Promise<ResLoginDto> {
    const { exist, user } = await this._validateStrategies(
      signupLocalDto.email,
      SourceEnum.EMAIL,
    );

    if (exist && user) throw new ConflictException('Email already exists');

    const defaultRole = await this._roleRepo.findOne({
      where: { name: RoleEnum.USER },
    });

    const defaultSource = await this._sourceRepo.findOne({
      where: { name: SourceEnum.EMAIL },
    });

    const password = await this.hashData(signupLocalDto.password);
    const newUser = this._userRepo.create({
      ...signupLocalDto,
      source: defaultSource,
      role: defaultRole,
      password,
    });

    const { role, id: sub, firstName: name } = newUser;
    const tokens = await this.getTokens({
      role: defaultRole.name,
      sub,
      name,
    });

    const { id, firstName, email, image } = await this._userRepo.save({
      ...newUser,
      refreshToken: tokens.refreshToken,
      recoveryToken: tokens.recoveryToken,
    });

    // return {
    //   id: newUser.id,
    //   name: newUser.firstName,
    //   email: newUser.email,
    //   ...tokens,
    // };
    return {
      ok: true,
      message: 'Register success',
      user: {
        id,
        name: firstName,
        email,
        role: role.name,
        image:
          'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010',
      },
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }

  async siginLocal({ email, password }: LoginAuthDto): Promise<ResLoginDto> {
    const user = await this.validateCredentials(email, password);

    console.log(user);
    const { role, id: sub, firstName: name } = user;
    const tokens = await this.getTokens({
      role: role.name,
      sub,
      name,
    });
    console.log(tokens);

    await this._updateRefreshToken(user.id, tokens.refreshToken);
    // return { id: user.id, name: user.firstName, ...tokens };
    return {
      ok: true,
      message: 'Login success',
      user: {
        id: user.id,
        name: user.firstName,
        email: user.email,
        role: user.role.name,
        image: user.image
          ? user.image.secure_url
          : 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010',
      },
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }

  async logout(userId: number): Promise<ResLogOutnDto> {
    await this._userRepo.update(userId, { refreshToken: null });
    return {
      ok: true,
      message: 'Logout success',
    };
  }

  async refreshTokens(
    userId: number,
    refreshToken: string,
  ): Promise<ResRefreshDto> {
    const user = await this._userRepo.findOne({
      where: { id: userId },
      relations: ['role'],
    });
    // console.log(user);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatched = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatched) throw new UnauthorizedException('Invalid credentials');

    const { role, id: sub, firstName: name } = user;
    // console.log(user);
    const tokens = await this.getTokens({
      role: role.name,
      sub,
      name,
    });

    await this._updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ok: true,
      message: 'Refresh token success',
      user: {
        id: user.id,
        name: user.firstName,
        email: user.email,
        role: user.role.name,
        image: user.image
          ? user.image.secure_url
          : 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010',
      },
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }

  async handleGoogleAuth2(data: CreateUserGoogleDto): Promise<ResLoginDto> {
    const { exist, user } = await this._validateStrategies(
      data.email,
      SourceEnum.GOOGLE,
    );

    // if (!exist && user) throw new ConflictException('Email already in use');

    if (exist && user) {
      const { role, id: sub, firstName: name } = user;
      const tokens = await this.getTokens({
        role: role.name,
        sub,
        name,
      });

      await this._updateRefreshToken(user.id, tokens.refreshToken);
      // return { id: user.id, name: user.firstName, ...tokens };
      return {
        ok: true,
        message: 'Login success',
        user: {
          id: user.id,
          name: user.firstName,
          email: user.email,
          role: user.role.name,
          image: user.image
            ? user.image.secure_url
            : 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010',
        },
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
      };
    }

    const newUser = this._userRepo.create(data);

    const hashPassword = await bcrypt.hash(
      newUser.password,
      this._configService.hash.bycryptSalt,
    );
    newUser.password = hashPassword;

    newUser.role = await this._roleRepo.findOne({
      where: { name: RoleEnum.ADMIN },
    });

    newUser.source = await this._sourceRepo.findOne({
      where: { name: SourceEnum.GOOGLE },
    });
    console.log(newUser);
    const { role, id: sub, firstName: name } = newUser;
    const tokens = await this.getTokens({
      role: role.name,
      sub,
      name,
    });

    const { id, firstName, email, image } = await this._userRepo.save({
      ...newUser,
      refreshToken: tokens.refreshToken,
      recoveryToken: tokens.recoveryToken,
    });

    return {
      ok: true,
      message: 'Register success',
      user: {
        id,
        name: firstName,
        email,
        role: role.name,
        image: image.secure_url
          ? image.secure_url
          : 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010',
      },
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }

  async _validateStrategies(
    email: string,
    strategy: SourceEnum,
  ): Promise<{ exist: boolean; user: User }> {
    const existUser = await this._userRepo.findOne({
      where: { email },
      relations: ['source', 'role'],
    });

    // Deuelve false si el usuario no existe en la base de datos
    if (!existUser) return { exist: false, user: null };

    // Solo devuelve false si el usuario existe pero no es de la estrategia
    // console.log(existUser);
    // return existUser.source.name === strategy
    //   ? { exist: true, user: existUser }
    //   : { exist: false, user: existUser };
    return { exist: true, user: existUser };
  }

  async validateCredentials(email: string, password: string) {
    const user = await this._userRepo.findOne({
      where: { email },
      relations: ['role', 'source', 'image'],
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  hashData(data: string) {
    return bcrypt.hash(data, this._configService.hash.bycryptSalt);
  }

  async getTokens(payload: PayloadToken) {
    const [accessToken, refreshToken, recoveryToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this._configService.jwt.accessToken.secret,
        expiresIn: this._configService.jwt.accessToken.expiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: this._configService.jwt.refreshToken.secret,
        expiresIn: this._configService.jwt.refreshToken.expiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: this._configService.jwt.recoveryToken.secret,
        expiresIn: this._configService.jwt.recoveryToken.expiresIn,
      }),
    ]);

    return { accessToken, refreshToken, recoveryToken };
  }

  private async _updateRefreshToken(userId: number, refreshToken: string) {
    const hash = await this.hashData(refreshToken);
    await this._userRepo.update(userId, { refreshToken: hash });
  }
}
