import { registerAs } from '@nestjs/config';
export default registerAs('config', () => {
  return {
    isProduction: process.env.NODE_ENV === 'production' ? true : false,
    jwt: {
      accessToken: {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
      },
      refreshToken: {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
      },
      recoveryToken: {
        secret: process.env.RECOVERY_TOKEN_SECRET,
        expiresIn: process.env.RECOVERY_TOKEN_EXPIRATION,
      },
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRATION,
    },
    files: {
      maxUploadSize: Number(process.env.MAX_UPLOAD_SIZE),
      cloudinary: {
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      },
      aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
      },
    },
    postgres: {},
    hash: {
      bycryptSalt: Number(process.env.BYCRYPT_SALT),
    },
    strategies: {
      google: {
        oauth2: {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL,
          scope: ['email', 'profile'],
          accessType: process.env.GOOGLE_ACCESS_TYPE,
        },
      },
    },
  };
});
