import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { UserRoleModel } from '../models/user-role.model';

@Injectable()
export class UserRoleRepository {
  private result;

  constructor(
    @InjectModel('user-role')
    private readonly userRoleModel?: UserRoleModel,
  ) {}

  async insertRole(data) {
    let newRole = null;

    await this.userRoleModel
      .create(data)
      .then((data) => {
        newRole = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while role insertion!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return newRole;
  }

  async editRole(id, editedData) {
    await this.userRoleModel
      .updateOne({ _id: id }, editedData)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while role update!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async findARoleById(_id) {
    await this.userRoleModel
      .findOne({ _id })
      .where({ isDeleted: false })
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while finding a role in user role repository!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  async findARoleByName(roleName) {
    return await this.userRoleModel
      .findOne({ name: roleName })
      .where({ isDeleted: false });
  }

  async findRoleByDepartment(roleDepartment) {
    await this.userRoleModel
      .find({ department: roleDepartment })
      .where({ isDeleted: false })
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a role!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  async findARoleByLabel(roleLabel) {
    await this.userRoleModel
      .findOne({ label: roleLabel })
      .where({ isDeleted: false })
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a role!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }
}
