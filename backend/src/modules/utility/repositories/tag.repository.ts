import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { TagModel } from '../models/tag.model';

@Injectable()
export class TagRepository {
  private result;

  constructor(
    @InjectModel('tag')
    private readonly tagModel?: TagModel,
  ) {}

  async create(data) {
    let newTag = null;

    await this.tagModel
      .create(data)
      .then((data) => {
        newTag = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while Content Tag insertion!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return newTag;
  }

  async edit(id, editedData) {
    return await this.tagModel.updateOne({ _id: id }, editedData);
  }

  async findTagByUserId(userId) {
    await this.tagModel
      .findOne({ user: userId })
      .where({ isDeleted: false })
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while finding an address in content tag repository!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  async findById(_id, whereCondition, populateCondition, selectCondition) {
    await this.tagModel
      .findOne({ _id })
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }

  async findByName(name, whereCondition, populateCondition, selectCondition) {
    await this.tagModel
      .findOne({ name })
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }

  async searchTags(finalQuery, options) {
    await this.tagModel
      .paginate(finalQuery, options)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a tag!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  async paginate(finalQuery, options) {
    return await this.tagModel.paginate(finalQuery, options, (error, data) => {
      if (error) {
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          'An error occurred while paginate tags.',
        );
      } else {
        return data;
      }
    });
  }
}
