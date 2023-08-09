import { v2 as cloudinary } from 'cloudinary';

import { ProviderEnum } from 'src/constants/provider.model';
import config from '../../config';
import { ConfigType } from '@nestjs/config';

export const CloudinaryProvider = {
  provide: ProviderEnum.CLOUDINARY,
  inject: [config.KEY],
  useFactory: async ({
    files: {
      cloudinary: { api_key, api_secret, cloud_name },
    },
  }: ConfigType<typeof config>) => {
    return cloudinary.config({ cloud_name, api_key, api_secret });
  },
};
