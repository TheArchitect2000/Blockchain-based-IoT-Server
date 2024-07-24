import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoClient, ObjectID } from 'mongodb';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GereralException } from 'src/modules/utility/exceptions/general.exception';
import { UserPermissionModel } from '../models/user-permission.model';

@Injectable()
export class UserPermissionRepository {
  private result;

  constructor(
    @InjectModel('user-permission')
    private readonly userPermissionModel?: UserPermissionModel,
  ) {}

  async insertPermission(data) {
    let newPermission = null;

    await this.userPermissionModel
      .create(data)
      .then((data) => {
        newPermission = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while permission insertion!';

        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return newPermission;
  }

  async editPermission(id, editedData) {
    await this.userPermissionModel
      .updateOne({ _id: id }, editedData)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while permission update!';
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async findAPermissionById(_id) {
    const userInfoId = new ObjectID(_id);

    await this.userPermissionModel
      .findOne({ _id })
      .where({ isDeleted: false })
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while finding a permission in user permission repository!';
        throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  async findAPermissionByLabel(permissionLabel) {
    await this.userPermissionModel
      .findOne({ label: permissionLabel })
      .where({ isDeleted: false })
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a permission!';
        throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  async findAPermissionByName(permissionName) {
    await this.userPermissionModel
      .findOne({ name: permissionName })
      .where({ isDeleted: false })
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a permission!';
        throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  async findPermissionByModule(permissionModule) {
    await this.userPermissionModel
      .find({ module: permissionModule })
      .where({ isDeleted: false })
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a permission!';
        throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    console.log(this.result);

    return this.result;
  }
}
