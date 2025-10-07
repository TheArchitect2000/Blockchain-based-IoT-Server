import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoClient, ObjectID } from 'mongodb';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { CategoryModel } from '../models/category.model';

@Injectable()
export class CategoryRepository {
  private result;

  constructor(
    @InjectModel('category')
    private readonly categoryModel?: CategoryModel,
  ) {}

  async insertCategory(data) {
    let newCategory = null;

    await this.categoryModel
      .create(data)
      .then((data) => {
        newCategory = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while Category insertion!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return newCategory;
  }

  async findById(_id, whereCondition, populateCondition, selectCondition) {
    return await this.categoryModel
      .findOne({ _id })
      .where(whereCondition)
      .populate(populateCondition)
      .select(selectCondition);
  }

  async editCategory(id, editedData) {
    await this.categoryModel
      .updateOne({ _id: { $eq: id } }, editedData)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while category update!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async findCategoryById(_id) {
    const articaleCategoryId = new ObjectID(_id);

    await this.categoryModel
      .findOne({ _id })
      .where({ isDeleted: false })
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage =
          'Some errors occurred while finding a category in category repository!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  async findACategoryByName(categoryName) {
    await this.categoryModel
      .findOne({ name: categoryName })
      .where({ isDeleted: false })
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a category!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  async searchCategories(finalQuery, options) {
    await this.categoryModel
      .paginate(finalQuery, options)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a category!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }
}
