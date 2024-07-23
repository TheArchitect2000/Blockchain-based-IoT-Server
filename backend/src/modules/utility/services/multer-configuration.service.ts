import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  MulterOptionsFactory,
  MulterModuleOptions,
} from '@nestjs/platform-express';
import { GereralException } from '../exceptions/general.exception';
import { ErrorTypeEnum } from '../enums/error-type.enum';
import * as fs from 'fs';

/**
 * Upload file configuration service
 */

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private readonly configService?: ConfigService) {}

  async createMulterOptions(): Promise<MulterModuleOptions> {
    return {
      dest: this.configService.get<string>('multer.medias.path'),

      storage: diskStorage({
        destination: async (req, file, callback) => {
          const path: string =
            this.configService.get<string>('multer.medias.path');

          if (!fs.existsSync(path)) fs.mkdirSync(path);
          return callback(null, path);
        },

        filename: (req, file, callback) => {
          if (!file.originalname) {
            let errorMessage = 'Media is not valid!';
            return callback(
              new GereralException(
                ErrorTypeEnum.UNPROCESSABLE_ENTITY,
                errorMessage,
              ),
              null,
            );
          }
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');

          let newname = randomName + new Date().getTime();

          return callback(null, `${newname}${extname(file.originalname)}`);
        },
      }),

      fileFilter: (req, file, callback) => {
        const MediaType = ['.png', '.jpg', '.jpeg', '.svg', '.pdf'];
        if (!MediaType.includes(extname(file.originalname))) {
          let errorMessage = 'Media is not valid!';
          return callback(
            new GereralException(
              ErrorTypeEnum.UNPROCESSABLE_ENTITY,
              errorMessage,
            ),
            false,
          );
        }
        return callback(null, true);
      },

      limits: {
        fileSize: this.configService.get<number>('multer.medias.size'),
      },
    };
  }
}
