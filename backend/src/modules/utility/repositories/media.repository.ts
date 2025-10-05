import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MediaModel } from '../models/media.model';

@Injectable()
export class MediaRepository {
  private result;

  constructor(
    @InjectModel('media')
    private readonly mediaModel: MediaModel,
  ) {}

  async create(data) {
    return await this.mediaModel.create(data);
  }

  async findById(_id) {
    await this.mediaModel.findOne({ _id: _id }).then((data) => {
      this.result = data;
    });

    return this.result;
  }
}
