import { InjectModel } from '@nestjs/mongoose';
import { StorxModel } from '../models/storx.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StorxRepository {
  constructor(
    @InjectModel('storx')
    private readonly storxModel: StorxModel,
  ) {}

  async insertStorx(data) {
    return await this.storxModel.create(data);
  }

  async getStorxByUserId(userId: string) {
    return await this.storxModel.findOne().where('userId').equals(userId);
  }
}
