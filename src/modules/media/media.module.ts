import { Module } from "@nestjs/common";
import { MediaController } from "./controller/media.controller";
import { MediaService } from "./services/media.service";
import { InjectModel, MongooseModule } from "@nestjs/mongoose";
import { MediaRepository } from "../utility/repositories/media.repository";
import { mediaSchema } from "./schema/media.schema";
import { MulterModule } from "@nestjs/platform-express";
import { extname } from "path";
import { diskStorage } from "multer";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'media', schema: mediaSchema }]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
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


/* 
{
  "statusCode": 200,
  "success": true,
  "date": "2024-05-30T07:41:36.469Z",
  "message": "Your request was successful.",
  "data": {
    "_id": "66582db0c732077c8ff776d2",
    "fileName": "file-1717054896424-640798276.png",
    "path": "uploads/file-1717054896424-640798276.png",
    "size": 9694,
    "type": "content",
    "destination": "./uploads",
    "mediaType": "image/png",
    "encoding": "7bit"
  }
}
*/