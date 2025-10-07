import { Injectable } from '@nestjs/common';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { MongoClient, ObjectID } from 'mongodb';
import { Types } from 'mongoose';
import { CategoryRepository } from '../repositories/category.repository';
import { MediaService } from 'src/modules/utility/services/media.service';
import { categoryTypeEnum } from './../enums/category-type.enum';

@Injectable()
export class CategoryService {
  private result;

  constructor(
    private readonly categoryRepository?: CategoryRepository,
    private readonly mediaService?: MediaService,
  ) {}

  async insertCategoryByPanel(data, userId) {
    let foundCategory = await this.categoryRepository.findACategoryByName(
      data.name,
    );

    if (foundCategory) {
      throw new GeneralException(
        ErrorTypeEnum.CONFLICT,
        'This category already exists!',
      );
    } else {
      let whereCondition = { isDeleted: false };
      let populateCondition = [];
      let selectCondition = '';

      let foundedParent = await this.categoryRepository.findById(
        data.parent,
        whereCondition,
        populateCondition,
        selectCondition,
      );
      if (data.parent) {
        if (!foundedParent) {
          throw new GeneralException(
            ErrorTypeEnum.NOT_FOUND,
            'parent does not exist.',
          );
        }
      }

      let foundedImage = await this.mediaService.findById(
        data.image,
        whereCondition,
        populateCondition,
        selectCondition,
      );
      if (data.image) {
        if (!foundedImage) {
          throw new GeneralException(
            ErrorTypeEnum.NOT_FOUND,
            'image not uploaded or does not exist.',
          );
        }
      }

      if (data.type == categoryTypeEnum.SUBCATEGORY) {
        if (!data.parent) {
          throw new GeneralException(
            ErrorTypeEnum.UNPROCESSABLE_ENTITY,
            'subCategort must have a parent.',
          );
        }
      }

      let newCategory = {
        name: data.name,
        type: data.type,
        sort: data.sort ? data.sort : 1,
        parent: data.parent ? foundedParent._id : null,
        description: data.description ? data.description : null,
        image: data.image ? foundedImage._id : null,
        content: data.content ? data.content : null,
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

      let insertedCategory = await this.categoryRepository.insertCategory(
        newCategory,
      );
      let foundedNewCategory = await this.categoryRepository.findById(
        insertedCategory._id,
        whereCondition,
        populateCondition,
        selectCondition,
      );

      return {
        name: foundedNewCategory.name,
        type: foundedNewCategory.type,
        sort: foundedNewCategory.sort,
        parent: foundedNewCategory.parent,
        description: foundedNewCategory.description,
        image: foundedNewCategory.image,
        content: foundedNewCategory.content,
        insertedBy: foundedNewCategory.insertedBy,
        insertDate: foundedNewCategory.insertDate,
        updatedBy: foundedNewCategory.updatedBy,
        updateDate: foundedNewCategory.updateDate,
        activationStatus: foundedNewCategory.activationStatus,
        activationStatusChangeReason:
          foundedNewCategory.activationStatusChangeReason,
        activationStatusChangedBy: foundedNewCategory.activationStatusChangedBy,
        activationStatusChangeDate:
          foundedNewCategory.activationStatusChangeDate,
        verificationStatus: foundedNewCategory.verificationStatus,
        verificationStatusChangeReason:
          foundedNewCategory.verificationStatusChangeReason,
        verificationStatusChangedBy:
          foundedNewCategory.verificationStatusChangedBy,
        verificationStatusChangeDate:
          foundedNewCategory.verificationStatusChangeDate,
        isDeletable: foundedNewCategory.isDeletable,
        isDeleted: foundedNewCategory.isDeleted,
        deletedBy: foundedNewCategory.deletedBy,
        deleteDate: foundedNewCategory.deleteDate,
        deletionReason: foundedNewCategory.deletionReason,
      };
    }
  }

  async editCategoryByPanel(data, userId): Promise<any> {
    let foundCategory = null;
    await this.categoryRepository
      .findCategoryById(data._id)
      .then((data) => {
        foundCategory = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a category!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    if (foundCategory) {
      if (foundCategory.name) {
        foundCategory.name = data.name;
      }
      if (foundCategory.description) {
        foundCategory.description = data.description;
      }
      if (foundCategory.parent) {
        foundCategory.parent = data.parent;
      }
      if (foundCategory.tags) {
        foundCategory.tags = data.tags;
      }
      if (foundCategory.image) {
        foundCategory.image = data.image;
      }
      foundCategory.updateDate = new Date();
      foundCategory.updatedBy = userId;

      await this.categoryRepository
        .editCategory(foundCategory._id, foundCategory)
        .then((data) => {
          this.result = data;
        })
        .catch((error) => {
          let errorMessage = 'Some errors occurred while editing a category!';
          throw new GeneralException(
            ErrorTypeEnum.UNPROCESSABLE_ENTITY,
            errorMessage,
          );
        });
    }

    return this.result;
  }

  async changeActivationStatusOfCategory(data, userId): Promise<any> {
    let foundCategory = null;
    await this.categoryRepository
      .findCategoryById(data._id)
      .then((data) => {
        foundCategory = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a category!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    foundCategory.activationStatus = data.activationStatus;
    foundCategory.activationStatusChangeReason =
      data.activationStatusChangeReason;
    foundCategory.activationStatusChangedBy = userId;
    foundCategory.activationStatusChangeDate = new Date();
    foundCategory.updatedBy = userId;
    foundCategory.updateDate = new Date();

    await this.categoryRepository
      .editCategory(data._id, foundCategory)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while editing a category!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async changeVerificationStatusOfCategory(data, userId): Promise<any> {
    let foundCategory = null;
    await this.categoryRepository
      .findCategoryById(data._id)
      .then((data) => {
        foundCategory = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a category!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    foundCategory.verificationStatus = data.verificationStatus;
    foundCategory.verificationStatusChangeReason =
      data.verificationStatusChangeReason;
    foundCategory.verificationStatusChangedBy = userId;
    foundCategory.verificationStatusChangeDate = new Date();
    foundCategory.updatedBy = userId;
    foundCategory.updateDate = new Date();

    await this.categoryRepository
      .editCategory(data._id, foundCategory)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while editing a category!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async findACategoryById(categoryId) {
    if (Types.ObjectId.isValid(String(categoryId))) {
      await this.categoryRepository
        .findCategoryById(categoryId)
        .then((data) => {
          this.result = data;
        })
        .catch((error) => {
          let errorMessage = 'Some errors occurred while finding a category!';
          throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
        });
    }

    return this.result;
  }

  async findCategoryById(categoryId) {
    if (ObjectID.isValid(categoryId)) {
      await this.categoryRepository
        .findCategoryById(categoryId)
        .then((data) => {
          this.result = data;
        })
        .catch((error) => {
          let errorMessage = 'Some errors occurred while finding a category!';
          throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
        });
    }

    return this.result;
  }

  async findACategoryByName(categoryName) {
    await this.categoryRepository
      .findACategoryByName(categoryName)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a category!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  async searchCategories(
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

    /* let fromDateISO: any;
        let toDateISO: any; */

    if (sortMode === 'ASCENDING' || sortMode === 'ascending') {
      sortMode = 'ASC';
    } else if (sortMode === 'DESCENDING' || sortMode === 'descending') {
      sortMode = 'DESC';
    }

    /* fromDateISO = new Date(fromDate).toISOString();
        toDateISO = new Date(toDate).toISOString();
        fromDate = new Date(fromDate).toString();
        toDate = new Date(toDate).toString(); */

    /* fromDateISO = new Date(fromDate).toISOString();
        toDateISO = new Date(toDate).toISOString();

        $and.push({ 
            insertDate: {
                $gte: fromDateISO,
                $lte: toDateISO
            }
        }); */

    if (
      fromDate !== null &&
      fromDate !== '' &&
      fromDate !== undefined &&
      toDate !== null &&
      toDate !== '' &&
      toDate !== undefined
    ) {
      $and.push({
        insertDate: {
          $gte: fromDate,
          $lte: toDate,
        },
      });
    }
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

    await this.categoryRepository
      .searchCategories(finalQuery, options)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        console.log(error);

        let errorMessage = 'Some errors occurred while search in categories!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async deleteContentCategory(data, userId): Promise<any> {
    let foundCategory = null;
    await this.categoryRepository
      .findCategoryById(data._id)
      .then((data) => {
        foundCategory = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while finding a category!';
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    if (
      foundCategory &&
      foundCategory !== undefined &&
      foundCategory.deletable
    ) {
      foundCategory.isDeleted = data.isDeleted;
      foundCategory.deletionReason = data.deletionReason;
      foundCategory.deletedBy = userId;
      foundCategory.deleteDate = new Date();
    }

    await this.categoryRepository
      .editCategory(data._id, foundCategory)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        let errorMessage = 'Some errors occurred while editing a category!';
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }
}
