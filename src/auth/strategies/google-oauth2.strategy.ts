import { ConfigType } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

import config from '../../config';
import { CreateUserGoogleDto } from '../../users/dtos/users/actions-user.dto';

@Injectable()
export class GoogleOAuth2Strategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(config.KEY)
    {
      strategies: {
        google: { oauth2 },
      },
    }: ConfigType<typeof config>,
  ) {
    super({
      clientID: oauth2.clientID,
      clientSecret: oauth2.clientSecret,
      callbackURL: oauth2.callbackURL,
      scope: oauth2.scope,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { /* id ,*/ name, emails /* photos */ } = profile;

    const user: CreateUserGoogleDto = {
      email: emails[0].value,
      password: '',
      firstName: name.givenName,
      lastName: name.familyName,
      phone: '',
      // picture: photos[0].value,
      // accessToken,
      // refreshToken,
    };

    done(null, user);
  }
}
