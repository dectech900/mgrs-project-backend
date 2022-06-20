import * as dotenv from 'dotenv';
dotenv.config();

export const env = {
  app: {
    client_base_url: process.env.CLIENT_BASE_URL,
  },
  server: {
    server_base_url: process.env.SERVER_BASE_URL,
  },
  env: process.env.NODE_ENV,
  emailVerifyKey: process.env.EMAIL_VERIFICATION_TOKEN_SECRET,
  encryptionKey: process.env.ENCRYPTION_KEY,
  // PRODUCTS_IAMGE_UPLOADS: process.env.PRODUCTS_IAMGE_UPLOADS,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};
