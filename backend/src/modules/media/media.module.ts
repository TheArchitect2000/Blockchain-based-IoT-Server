import { Module } from '@nestjs/common';
import { MediaController } from './controller/media.controller';
import { MediaService } from './services/media.service';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { MediaRepository } from '../utility/repositories/media.repository';
import { mediaSchema } from './schema/media.schema';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'media', schema: mediaSchema }]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
