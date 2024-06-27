import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { ErrorTypeEnum } from '../enums/error-type.enum';
import { GereralException } from '../exceptions/general.exception';
import { MediaModel } from '../models/media.model';
import { MediaRepository } from '../repositories/media.repository';
import { uploadFileDto } from '../data-transfer-objects/upload-file.dto';

/**
 * Media manipulation service.
 */

@Injectable()
export class MediaService {
  constructor(
    @InjectModel('media')
    private readonly mediaModel: MediaModel,
    private readonly mediaRepository: MediaRepository,
    private readonly configService: ConfigService,
  ) {}

  async insertMedia(
    type: string,
    body: uploadFileDto,
    userId: string,
    file: Express.Multer.File,
  ) {
    console.log('We are in Insert media');

    const newMedium = {
      user: userId,
      type: type,
      encoding: file.encoding,
      mediaType: file.mimetype,
      destination: file.destination,
      fileName: file.filename,
      path: file.path,
      size: file.size,
      insertedBy: userId,
      insertDate: new Date(),
      updatedBy: userId,
      updateDate: new Date(),
    };

    try {
      const uploadedFile = await this.mediaRepository.create(newMedium);

      if (uploadedFile) {
        return {
          _id: uploadedFile._id,
          fileName: uploadedFile.fileName,
          path: uploadedFile.path,
          size: uploadedFile.size,
          type: uploadedFile.type,
          destination: uploadedFile.destination,
          mediaType: uploadedFile.mediaType,
          encoding: uploadedFile.encoding,
        };
      } else {
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          'An error occurred while uploading the file.',
        );
      }
    } catch (error) {
      throw new GereralException(
        ErrorTypeEnum.INTERNAL_SERVER_ERROR,
        'An error occurred while saving the file to the database.',
      );
    }
  }

  async findById(id, whereCondition, populateCondition, selectCondition) {
    return await this.mediaRepository.findById(id);
  }

  async getMediaById(id) {
    let whereCondition = { isDeleted: false };
    let populateCondition = [
      {
        path: 'user',
        select: 'firstName lastName userName mobile',
      },
    ];
    let selectCondition = 'firstName lastName userName mobile';

    return await this.mediaRepository.findById(id);
  }

  /* async getMediaVolumesSetting(file, type) {
        if(file && file.size){
            this.setting = await this.settingService.imageVolumesSettings();
            this.setting.items.forEach(set => {
                if (set.key == type && Number(set.value) * 1000 < Number(file.size)) {
                this.photoRepository.unlink(file.path, err => {
                    if (err) Logger.error(err, 'FileUploadInvalidVolume');
                });
                throw new PhotoInvalidSizeException();
                }
            });
        }else{
            throw new PhotoInvalidSizeException();
        }
    } */
}
