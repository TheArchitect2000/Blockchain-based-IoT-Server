import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoClient, ObjectID } from 'mongodb';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GereralException } from 'src/modules/utility/exceptions/general.exception';
import { MediaModel } from '../models/media.model';

@Injectable()
export class MediaRepository {
  constructor(
    @InjectModel('media')
    private readonly mediaModel: MediaModel,
  ) {}

  async create(data) {
    return await this.mediaModel.create(data);
  }

  async findById(_id, whereCondition, populateCondition, selectCondition) {
    return await this.mediaModel
      .findOne({ _id })
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }
}

