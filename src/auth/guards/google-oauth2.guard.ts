import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import config from 'src/config';

@Injectable()
export class GoogleOAuth2Guard extends AuthGuard('google') {
  constructor(
    @Inject(config.KEY)
    {
      strategies: {
        google: { oauth2 },
      },
    }: ConfigType<typeof config>,
  ) {
    super({ accessType: oauth2.accessType });
  }
}
