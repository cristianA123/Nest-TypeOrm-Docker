import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { ConfigType } from '@nestjs/config';

import { PayloadToken } from '../interfaces';
import config from '../../config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject(config.KEY) { jwt: { refreshToken } }: ConfigType<typeof config>,
  ) {
    super({
      // jwtFromRequest: ExtractJwt.fromExtractors([
      //   RefreshTokenStrategy.extractJWT,
      //   ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ]),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: refreshToken.secret,
      passReqToCallback: true,
    });
  }

  private static extractJWT(req: Request, payload: PayloadToken) {
    const refreshToken = req
      ?.get('authorization')
      ?.replace('Bearer', '')
      .trim();
    // console.log(refreshToken);

    if (!refreshToken) throw new ForbiddenException('Refresh token not found');

    // console.log(payload);
    // return { ...payload, refreshToken };
    // return refreshToken;
    return { req: refreshToken };
  }

  validate(req: Request, payload: PayloadToken) {
    const refreshToken = req
      ?.get('authorization')
      ?.replace('Bearer', '')
      .trim();
    // console.log(refreshToken);

    if (!refreshToken) throw new ForbiddenException('Refresh token not found');

    return { ...payload, refreshToken };
  }
}
