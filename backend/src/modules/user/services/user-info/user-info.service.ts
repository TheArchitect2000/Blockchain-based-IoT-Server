import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { UserInfoRepository } from '../../repositories/user-info.repository';
import { UserRepository } from '../../repositories/user.repository';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UserInfoService {
  private result;

  constructor(
    private readonly userInfoRepository?: UserInfoRepository,
    private readonly userRepository?: UserRepository,
  ) {}

  async insertUserInfoByUser(data, userId): Promise<any> {
    let newUser = {
      user: userId,
      nickName: data.nickName,
      email: data.email,
      website: data.website,
      telephone: data.telephone,
      fax: data.fax,
      biography: data.biography,
      nationalCode: data.nationalCode,
      insertedBy: userId,
      insertDate: new Date(),
      updatedBy: userId,
      updateDate: new Date(),
    };

    let user = null;
    let userInfo = null;

    let whereCondition = { isDeleted: false };
    let populateCondition = [
      {
        path: 'info',
        select:
          'nationalCode nickName fatherName email website telephone fax biography levelOfEducation',
        populate: [
          {
            path: 'profileImage',
          },
          {
            path: 'headerImage',
          },
        ],
      },
      {
        path: 'roles',
        populate: {
          path: 'permissions',
        },
      },
    ];
    let selectCondition = '';

    user = await this.userRepository
      .findUserById(userId, whereCondition, populateCondition, selectCondition)
      .catch((error) => {
        let errorMessage = 'Some errors occurred while inserting a user!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    if (user) {
      userInfo = await this.userInfoRepository
        .findAUserInfoByUserId(userId)
        .catch((error) => {
          let errorMessage = 'Some errors occurred while inserting a user!';
          throw new GeneralException(
            ErrorTypeEnum.UNPROCESSABLE_ENTITY,
            errorMessage,
          );
        });
    }

    if (userInfo) {
      let errorMessage =
        'Some errors occurred while inserting a user info, User info already exists!';
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    } else {
      await this.userInfoRepository
        .insertUserInfo(newUser)
        .then((data) => {
          this.result = data;
        })
        .catch((error) => {
          let errorMessage = 'Some errors occurred while inserting a user!';
          throw new GeneralException(
            ErrorTypeEnum.UNPROCESSABLE_ENTITY,
            errorMessage,
          );
        });
    }

    return this.result;
  }

  async insertUserInfoByPanel(data, userId): Promise<any> {
    let newUser = {
      user: data.userId,
      nickName: data.nickName,
      email: data.email,
      website: data.website,
      telephone: data.telephone,
      fax: data.fax,
      biography: data.biography,
      nationalCode: data.nationalCode,
      insertedBy: userId,
      insertDate: new Date(),
      updatedBy: userId,
      updateDate: new Date(),
    };

    let user = null;
    let userInfo = null;

    let whereCondition = { isDeleted: false };
    let populateCondition = [
      {
        path: 'info',
        select:
          'nationalCode nickName fatherName email website telephone fax biography levelOfEducation',
        populate: [
          {
            path: 'profileImage',
          },
          {
            path: 'headerImage',
          },
        ],
      },
      {
        path: 'roles',
        populate: {
          path: 'permissions',
        },
      },
    ];
    let selectCondition = '';

    user = await this.userRepository
      .findUserById(userId, whereCondition, populateCondition, selectCondition)
      .catch((error) => {
        let errorMessage = 'Some errors occurred while inserting a user!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    if (user) {
      userInfo = await this.userInfoRepository
        .findAUserInfoByUserId(data.userId)
        .catch((error) => {
          let errorMessage = 'Some errors occurred while inserting a user!';
          throw new GeneralException(
            ErrorTypeEnum.UNPROCESSABLE_ENTITY,
            errorMessage,
          );
        });
    }

    if (userInfo) {
      let errorMessage =
        'Some errors occurred while inserting a user info, User info already exists!';
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    } else {
      await this.userInfoRepository
        .insertUserInfo(newUser)
        .then((data) => {
          this.result = data;
        })
        .catch((error) => {
          let errorMessage = 'Some errors occurred while inserting a user!';
          throw new GeneralException(
            ErrorTypeEnum.UNPROCESSABLE_ENTITY,
            errorMessage,
          );
        });
    }

    return this.result;
  }

  async findAUserInfoById(userInfoId) {
    if (Types.ObjectId.isValid(String(userInfoId))) {
      await this.userInfoRepository
        .findAUserInfoById(userInfoId)
        .then((data) => {
          this.result = data;
        })
        .catch((error) => {
          let errorMessage = 'Some errors occurred while finding a user info!';
          throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
        });
    }

    return this.result;
  }

  async findAUserInfoByUserId(userId) {
    if (Types.ObjectId.isValid(String(userId))) {
      await this.userInfoRepository
        .findAUserInfoByUserId(userId)
        .then((data) => {
          this.result = data;
        })
        .catch((error) => {
          let errorMessage = 'Some errors occurred while finding a user info!';
          throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
        });
    }

    return this.result;
  }

  async editUserInfoByUser(data, userId): Promise<any> {
    let foundUserInfo = null;
    await this.userInfoRepository
      .findAUserInfoByUserId(userId)
      .then((data) => {
        foundUserInfo = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a user!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    if (foundUserInfo) {
      foundUserInfo.nickName = data.nickName;
      foundUserInfo.email = data.email;
      foundUserInfo.website = data.website;
      (foundUserInfo.telephone = data.telephone),
        (foundUserInfo.fax = data.fax),
        (foundUserInfo.biography = data.biography);
      foundUserInfo.nationalCode = data.nationalCode;
      foundUserInfo.updateDate = new Date();
      foundUserInfo.updatedBy = userId;

      await this.userInfoRepository
        .editUserInfo(foundUserInfo._id, foundUserInfo)
        .then((data) => {
          this.result = data;
        })
        .catch((error) => {
          let errorMessage = 'Some errors occurred while editing a user info!';
          throw new GeneralException(
            ErrorTypeEnum.UNPROCESSABLE_ENTITY,
            errorMessage,
          );
        });
    }

    return this.result;
  }

  async editUserByPanel(data, userId): Promise<any> {
    let foundUserInfo = null;
    await this.userInfoRepository
      .findAUserInfoByUserId(data.userId)
      .then((data) => {
        foundUserInfo = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a user!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    if (foundUserInfo) {
      foundUserInfo.nickName = data.nickName;
      foundUserInfo.email = data.email;
      foundUserInfo.website = data.website;
      (foundUserInfo.telephone = data.telephone),
        (foundUserInfo.fax = data.fax),
        (foundUserInfo.biography = data.biography);
      foundUserInfo.nationalCode = data.nationalCode;
      foundUserInfo.updateDate = new Date();
      foundUserInfo.updatedBy = userId;
      foundUserInfo.activationStatus = data.activationStatus;
      foundUserInfo.verificationStatus = data.verificationStatus;
      foundUserInfo.verificationStatusMessage = data.verificationStatusMessage;

      await this.userInfoRepository
        .editUserInfo(foundUserInfo._id, foundUserInfo)
        .then((data) => {
          this.result = data;
        })
        .catch((error) => {
          let errorMessage = 'Some errors occurred while editing a user info!';
          throw new GeneralException(
            ErrorTypeEnum.UNPROCESSABLE_ENTITY,
            errorMessage,
          );
        });
    }

    return this.result;
  }

  async deleteUserInfo(data, userId): Promise<any> {
    let foundUserInfo = null;
    await this.userInfoRepository
      .findAUserInfoById(data._id)
      .then((data) => {
        foundUserInfo = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a user!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    foundUserInfo.isDeleted = data.isDeleted;
    foundUserInfo.deletionReason = data.deletionReason;
    foundUserInfo.deletedBy = userId;
    foundUserInfo.deleteDate = new Date();

    await this.userInfoRepository
      .editUserInfo(data._id, foundUserInfo)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while editing a user!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }
}
