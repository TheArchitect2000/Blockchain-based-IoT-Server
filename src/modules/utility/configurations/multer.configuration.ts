import { registerAs } from '@nestjs/config';

export default registerAs('multer', () => ({
  medias: {
    path: process.env.MULTER_MEDIA_PATH,
    size: parseInt(process.env.MULTER_MEDIA_SIZE, 10) || 500000,
  },
}));
