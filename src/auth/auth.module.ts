import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import {
  GoogleOAuth2Strategy,
  RefreshTokenStrategy,
  AccessTokenStrategy,
} from './strategies';
import { LocalStrategy } from './strategies';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    GoogleOAuth2Strategy,
    LocalStrategy,
    RefreshTokenStrategy,
    AccessTokenStrategy,
  ],
  imports: [
    PassportModule,
    /* JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => ({
        secret: configService.jwt.secret,
        signOptions: { expiresIn: configService.jwt.expiration },
      }),
    }), */
    JwtModule.register({}),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
