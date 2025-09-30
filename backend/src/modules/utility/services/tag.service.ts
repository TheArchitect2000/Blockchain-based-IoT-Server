import { Injectable } from '@nestjs/common';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { ObjectId } from 'mongodb';
import { TagRepository } from '../repositories/tag.repository';
import { ActivationStatusEnum } from './../enums/activation-status.enum';
import { VerificationStatusEnum } from '../enums/verification-status.enum';

@Injectable()
export class TagService {
  private result;
  private tag;

  constructor(private readonly tagRepository?: TagRepository) {}

  async insertTagByPanel(data, userId) {
    let whereCondition = { isDeleted: false };
    let populateCondition = [];
    let selectCondition = '';

    this.tag = await this.tagRepository.findByName(
      data.name,
      whereCondition,
      populateCondition,
      selectCondition,
    );

    if (this.tag) {
      throw new GeneralException(
        ErrorTypeEnum.CONFLICT,
        'This tag already exists!',
      );
    } else {
      let newTag = {
        name: data.name,
        activationStatus: data.activationStatus ? data.activationStatus : null,
        activationStatusChangeReason: data.activationStatusChangeReason
          ? data.activationStatusChangeReason
          : null,
        verificationStatus: data.verificationStatus
          ? data.verificationStatus
          : null,
        verificationStatusChangeReason: data.verificationStatusChangeReason
          ? data.verificationStatusChangeReason
          : null,
        insertedBy: userId,
        insertDate: new Date(),
        updatedBy: userId,
        updateDate: new Date(),
      };

      let insertedTag = await this.tagRepository.create(newTag);
      let foundedNewTag: any = await this.tagRepository.findById(
        insertedTag._id,
        whereCondition,
        populateCondition,
        selectCondition,
      );

      return await this.tagPanelResponse(foundedNewTag);
    }
  }

  async updateTagByPanel(data, userId): Promise<any> {
    let whereCondition = { isDeleted: false };
    let populateCondition = [];
    let selectCondition = '';

    this.tag = await this.tagRepository.findByName(
      data.name,
      whereCondition,
      populateCondition,
      selectCondition,
    );

    if (this.tag) {
      this.tag.name = data.name;

      await this.tagRepository.edit(this.tag._id, this.tag);

      let foundedNewTag: any = await this.tagRepository.findById(
        this.tag._id,
        whereCondition,
        populateCondition,
        selectCondition,
      );

      return await this.tagPanelResponse(foundedNewTag);
    } else {
      throw new GeneralException(ErrorTypeEnum.NOT_FOUND, 'tag not find.');
    }
  }

  async editTagByPanel(data, userId): Promise<any> {
    let whereCondition = { isDeleted: false };
    let populateCondition = [];
    let selectCondition = '';

    let foundTag = null;
    await this.tagRepository
      .findById(data._id, whereCondition, populateCondition, selectCondition)
      .then((data) => {
        foundTag = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a Tag!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    if (foundTag) {
      if (foundTag.name) {
        foundTag.name = data.name;
      }
      foundTag.updateDate = new Date();
      foundTag.updatedBy = userId;

      await this.tagRepository
        .edit(foundTag._id, foundTag)
        .then((data) => {
          this.result = data;
        })
        .catch((error) => {
          let errorMessage = 'Some errors occurred while editing a Tag!';
          throw new GeneralException(
            ErrorTypeEnum.UNPROCESSABLE_ENTITY,
            errorMessage,
          );
        });
    }

    return this.result;
  }

  async editTagByUser(data, userId): Promise<any> {
    let whereCondition = { isDeleted: false };
    let populateCondition = [];
    let selectCondition = '';

    let foundTag = null;
    await this.tagRepository
      .findById(data._id, whereCondition, populateCondition, selectCondition)
      .then((data) => {
        foundTag = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a Tag!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    if (foundTag) {
      if (foundTag.name) {
        foundTag.name = data.name;
      }
      foundTag.updateDate = new Date();
      foundTag.updatedBy = userId;

      await this.tagRepository
        .edit(foundTag._id, foundTag)
        .then((data) => {
          this.result = data;
        })
        .catch((error) => {
          let errorMessage = 'Some errors occurred while editing a tag!';
          throw new GeneralException(
            ErrorTypeEnum.UNPROCESSABLE_ENTITY,
            errorMessage,
          );
        });
    }

    return this.result;
  }

  async changeActivationStatus(data, tagId, userId) {
    let whereCondition = { isDeleted: false };
    let populateCondition = [];
    let selectCondition = '';

    this.tag = await this.tagRepository.findById(
      tagId,
      whereCondition,
      populateCondition,
      selectCondition,
    );

    if (this.tag) {
      if (this.tag.activationStatus == ActivationStatusEnum.ACTIVE) {
        this.tag.activationStatus = ActivationStatusEnum.INACTIVE;
        this.tag.activationStatusChangeReason =
          data.activationStatusChangeReason;
        this.tag.updatedBy = userId;
        this.tag.updateDate = new Date();

        await this.tagRepository.findById(
          this.tag._id,
          whereCondition,
          populateCondition,
          selectCondition,
        );
        return await this.tagPanelResponse(this.tag);
      }
      if (this.tag.activationStatus == ActivationStatusEnum.INACTIVE) {
        this.tag.activationStatus = ActivationStatusEnum.ACTIVE;
        this.tag.activationStatusChangeReason =
          data.activationStatusChangeReason;
        this.tag.updatedBy = userId;
        this.tag.updateDate = new Date();

        await this.tagRepository.findById(
          this.tag._id,
          whereCondition,
          populateCondition,
          selectCondition,
        );
        return await this.tagPanelResponse(this.tag);
      }
    } else {
      throw new GeneralException(ErrorTypeEnum.NOT_FOUND, 'tag not find.');
    }
  }

  async changeVerificationStatus(data, tagId, userId) {
    let whereCondition = { isDeleted: false };
    let populateCondition = [];
    let selectCondition = '';

    this.tag = await this.tagRepository.findById(
      tagId,
      whereCondition,
      populateCondition,
      selectCondition,
    );

    if (this.tag) {
      if (this.tag.activationStatus == VerificationStatusEnum.VERIFIED) {
        this.tag.verificationStatus = VerificationStatusEnum.UNVERIFIED;
        this.tag.verificationStatusChangeReason =
          data.verificationStatusChangeReason;
        this.tag.updatedBy = userId;
        this.tag.updateDate = new Date();

        await this.tagRepository.findById(
          this.tag._id,
          whereCondition,
          populateCondition,
          selectCondition,
        );
        return await this.tagPanelResponse(this.tag);
      }
      if (this.tag.activationStatus == VerificationStatusEnum.UNVERIFIED) {
        this.tag.verificationStatus = VerificationStatusEnum.VERIFIED;
        this.tag.verificationStatusChangeReason =
          data.verificationStatusChangeReason;
        this.tag.updatedBy = userId;
        this.tag.updateDate = new Date();

        await this.tagRepository.findById(
          this.tag._id,
          whereCondition,
          populateCondition,
          selectCondition,
        );
        return await this.tagPanelResponse(this.tag);
      }
    } else {
      throw new GeneralException(ErrorTypeEnum.NOT_FOUND, 'tag not find.');
    }
  }

  async findTagById(tagId) {
    let whereCondition = { isDeleted: false };
    let populateCondition = [];
    let selectCondition = '';

    this.tag = await this.tagRepository.findById(
      tagId,
      whereCondition,
      populateCondition,
      selectCondition,
    );

    if (this.tag) {
      return await this.tagUserResponse(this.tag);
    } else {
      throw new GeneralException(ErrorTypeEnum.NOT_FOUND, 'tag not find.');
    }
  }

  async findTagByName(tagName) {
    let whereCondition = { isDeleted: false };
    let populateCondition = [];
    let selectCondition = '';

    this.tag = await this.tagRepository.findByName(
      tagName,
      whereCondition,
      populateCondition,
      selectCondition,
    );

    if (this.tag) {
      return await this.tagUserResponse(this.tag);
    } else {
      throw new GeneralException(ErrorTypeEnum.NOT_FOUND, 'tag not find.');
    }
  }

  async findContentTagById(TagId) {
    let whereCondition = { isDeleted: false };
    let populateCondition = [];
    let selectCondition = '';

    if (ObjectId.isValid(TagId)) {
      await this.tagRepository
        .findById(TagId, whereCondition, populateCondition, selectCondition)
        .then((data) => {
          this.result = data;
        })
        .catch((error) => {
          let errorMessage = 'Some errors occurred while finding a Tag!';
          throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
        });
    }

    return this.result;
  }

  async findATagByName(TagName) {
    let whereCondition = { isDeleted: false };
    let populateCondition = [];
    let selectCondition = '';

    await this.tagRepository
      .findByName(TagName, whereCondition, populateCondition, selectCondition)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a Tag!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  async searchTags(
    pageNumber,
    limit,
    sortMode,
    searchText,
    activationStatus,
    verificationStatus,
    isDeleted,
    fromDate,
    toDate,
    userId,
  ) {
    let finalQuery = null;
    let $and: any = [];

    if (sortMode === 'ASCENDING' || sortMode === 'ascending') {
      sortMode = 'ASC';
    } else if (sortMode === 'DESCENDING' || sortMode === 'descending') {
      sortMode = 'DESC';
    }

    $and.push({
      insertDate: {
        $gte: fromDate,
        $lte: toDate,
      },
    });
    if (
      activationStatus !== null &&
      activationStatus !== '' &&
      activationStatus !== undefined
    ) {
      $and.push({ activationStatus: activationStatus });
    }
    if (
      verificationStatus !== null &&
      verificationStatus !== '' &&
      verificationStatus !== undefined
    ) {
      $and.push({ verificationStatus: verificationStatus });
    }
    /* if(isDeleted === "FALSE" || isDeleted === "false"){
            $and.push({ isDeleted: false });
        } else if(isDeleted === "TRUE" || isDeleted === "true"){
            $and.push({ isDeleted: true });
        } */

    $and.push({ isDeleted: false });

    if (searchText === '') {
      finalQuery = {
        $and,
      };
    } else {
      finalQuery = {
        $and,
        $or: [
          { name: { $regex: searchText, $options: 'i' } },
          {
            activationStatusChangeReason: { $regex: searchText, $options: 'i' },
          },
          {
            verificationStatusChangeReason: {
              $regex: searchText,
              $options: 'i',
            },
          },
          { deletionReason: { $regex: searchText, $options: 'i' } },
        ],
      };
    }

    let options = {
      page: pageNumber,
      sort: { insertDate: sortMode },
      populate: [
        {
          path: 'insertedBy',
          select: '_id email mobile firstName lastName',
        },
        {
          path: 'updatedBy',
          select: '_id email mobile firstName lastName',
        },
        {
          path: 'deletedBy',
          select: '_id email mobile firstName lastName',
        },
      ],
      limit: limit,
    };

    await this.tagRepository
      .searchTags(finalQuery, options)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        console.log(error);

        let errorMessage = 'Some errors occurred while search in tags!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async deleteTag(data, tagId, userId) {
    let whereCondition = { isDeleted: false };
    let populateCondition = [];
    let selectCondition = '';

    this.tag = await this.tagRepository.findById(
      tagId,
      whereCondition,
      populateCondition,
      selectCondition,
    );

    if (this.tag) {
      let whereCondition = { isDeleted: false };
      let populateCondition = [];
      let selectCondition = '';

      this.tag.isDeleted = true;
      this.tag.deletionReason = data.deletionReason;
      this.tag.deletedBy = userId;
      this.tag.deleteDate = new Date();

      await this.tagRepository.edit(this.tag._id, this.tag);

      let foundedNewTag: any = await this.tagRepository.findById(
        this.tag._id,
        whereCondition,
        populateCondition,
        selectCondition,
      );

      return await this.tagPanelResponse(foundedNewTag);
    } else {
      throw new GeneralException(ErrorTypeEnum.NOT_FOUND, 'tag not find.');
    }
  }

  async searchInTagsByUser(pageNumber, limit, sortMode, searchText, user) {
    let $and: any = [];
    $and.push({ isDeleted: false });
    // $and.push({ insertDate : {
    //     $gte:fromDate,
    //     $lte: toDate
    // }});

    // if (users && users[0] !== undefined){
    //     $and.push({ _id: { $in: users } });
    // }
    // if(activation!=""){
    //     $and.push({ isActive: Boolean(activation) });
    // }
    // if(verification!=""){
    //     $and.push({ isVerified: Boolean(verification) });
    // }

    let finalQuery = null;
    if (searchText === '') {
      finalQuery = {
        $and,
      };
    } else {
      finalQuery = {
        $and,
        $or: [
          { name: { $regex: searchText, $options: 'i' } },
          {
            activationStatusChangeReason: { $regex: searchText, $options: 'i' },
          },
          {
            verificationStatusChangeReason: {
              $regex: searchText,
              $options: 'i',
            },
          },
        ],
      };
    }

    let options = {
      page: pageNumber,
      sort: { insertDate: sortMode },
      // populate:[],
      limit: limit,
      select: 'name insertDate',
    };

    return await this.tagRepository.paginate(finalQuery, options);
  }

  async searchInTagsByPanel(
    pageNumber,
    limit,
    sortMode,
    searchText,
    activation,
    verification,
    fromDate,
    toDate,
    user,
  ) {
    let $and: any = [];
    $and.push({ isDeleted: false });
    $and.push({
      insertDate: {
        $gte: fromDate,
        $lte: toDate,
      },
    });

    // if (users && users[0] !== undefined){
    //     $and.push({ _id: { $in: users } });
    // }
    if (activation != '') {
      $and.push({ isActive: Boolean(activation) });
    }
    if (verification != '') {
      $and.push({ isVerified: Boolean(verification) });
    }

    let finalQuery = null;
    if (searchText === '') {
      finalQuery = {
        $and,
      };
    } else {
      finalQuery = {
        $and,
        $or: [
          { name: { $regex: searchText, $options: 'i' } },
          {
            activationStatusChangeReason: { $regex: searchText, $options: 'i' },
          },
          {
            verificationStatusChangeReason: {
              $regex: searchText,
              $options: 'i',
            },
          },
        ],
      };
    }

    let options = {
      page: pageNumber,
      sort: { insertDate: sortMode },
      populate: [
        {
          path: 'insertedBy',
          select: 'firstName lastName email mobile',
        },
        {
          path: 'updatedBy',
          select: 'firstName lastName email mobile',
        },
        {
          path: 'deletedBy',
          select: 'firstName lastName email mobile',
        },
      ],
      limit: limit,
      select:
        'name activationStatus activationStatusChangeReason activationStatusChangedBy activationStatusChangeDate verificationStatus verificationStatusChangeReason verificationStatusChangedBy verificationStatusChangeDate insertedBy insertDate updatedBy updateDate isDeletable isDeleted deletedBy deleteDate deletionReason',
    };

    return await this.tagRepository.paginate(finalQuery, options);
  }

  async tagUserResponse(data) {
    return {
      _id: data._id,
      name: data.name ? data.name : '',
      insertDate: data.insertDate ? data.insertDate : '',
      updateDate: data.updateDate ? data.updateDate : '',
    };
  }

  async tagPanelResponse(data) {
    return {
      _id: data._id,
      name: data.name ? data.name : '',
      activationStatus: data.activationStatus ? data.activationStatus : '',
      activationStatusChangeReason: data.activationStatusChangeReason
        ? data.activationStatusChangeReason
        : '',
      activationStatusChangedBy: data.activationStatusChangedBy
        ? data.activationStatusChangedBy
        : '',
      activationStatusChangeDate: data.activationStatusChangeDate
        ? data.activationStatusChangeDate
        : '',
      verificationStatus: data.verificationStatus
        ? data.verificationStatus
        : '',
      verificationStatusChangeReason: data.verificationStatus
        ? data.verificationStatus
        : '',
      verificationStatusChangedBy: data.verificationStatusChangedBy
        ? data.verificationStatusChangedBy
        : '',
      verificationStatusChangeDate: data.verificationStatusChangeDate
        ? data.verificationStatusChangeDate
        : '',
      insertedBy: data.insertedBy ? data.insertedBy : '',
      insertDate: data.insertDate ? data.insertDate : '',
      updatedBy: data.updatedBy ? data.updatedBy : '',
      updateDate: data.updateDate ? data.updateDate : '',
      isDeletable: data.isDeletable ? data.isDeletable : '',
      isDeleted: data.isDeleted ? data.isDeleted : '',
      deletedBy: data.deletedBy ? data.deletedBy : '',
      deleteDate: data.deleteDate ? data.deleteDate : '',
      deletionReason: data.deletionReason ? data.deletionReason : '',
    };
  }
}
