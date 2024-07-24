import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoClient, ObjectID } from 'mongodb';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GereralException } from 'src/modules/utility/exceptions/general.exception';
import { UserInfoModel } from '../models/user-info.model';

@Injectable()
export class UserInfoRepository {
  private result;

  constructor(
    @InjectModel('user-info')
    private readonly userInfoModel?: UserInfoModel,
  ) {}

  async create(data) {
    return await this.userInfoModel.create(data);
  }

  async insertUserInfo(data) {
    let newUser = null;

    await this.userInfoModel
      .create(data)
      .then((data) => {
        newUser = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while user insertion!';
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return newUser;
  }

  async editUserInfo(id, editedData) {
    return await this.userInfoModel.updateOne({ _id: id }, editedData);
  }

  async findAUserInfoById(_id) {
    const userInfoId = new ObjectID(_id);

    await this.userInfoModel
      .findOne({ _id })
      .where({ isDeleted: false })
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while finding a user in user repository!';
        throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  async findAUserInfoByUserId(_id) {
    return await this.userInfoModel.findOne({ user: _id });
  }
}
