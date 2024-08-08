import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GereralException } from 'src/modules/utility/exceptions/general.exception';
import { BuildingModel } from './building.model';
import { BuildingSchema } from './building.schema';

@Injectable()
export class BuildingRepository {
  private result;

  constructor(
    @InjectModel('building')
    private readonly buildingModel?: BuildingModel,
  ) {}

  getBuildingKeys(): string {
    return Object.keys(BuildingSchema.paths).join(' ');
  }

  async insertBuilding(data) {
    await this.buildingModel
      .create(data)
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        const errorMessage = 'Some errors occurred while inserting building!';
        console.log(error.message);
        throw new GereralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          errorMessage,
        );
      });

    return this.result;
  }

  async editBuildingById(buildId, editedFields) {
    try {
      const result = await this.buildingModel
        .updateOne(
          { _id: buildId },
          { $set: editedFields }, // Use $set to update specific fields
        )
        .exec();

      return result;
    } catch (error) {
      const errorMessage = 'Some errors occurred while editing building!';
      throw new GereralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }
  }

  async deleteBuildingByBuildId(BuilId) {
    await this.buildingModel
      .deleteMany()
      .where({ _id: BuilId })
      .then((data) => {
        this.result = data;
      })
      .catch((error) => {
        const errorMessage =
          'Some errors occurred while deleting user in user repository!';
        throw new GereralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
      });

    return this.result;
  }

  async getAllBuildings() {
    return await this.buildingModel
      .find({})
      .where({})
      .populate([])
      .select(this.getBuildingKeys());
  }

  async getBuildingByBuildId(buildId) {
    return await this.buildingModel
      .findOne({ _id: buildId })
      .where({})
      .populate([])
      .select(this.getBuildingKeys());
  }

  async getBuildingsByUserId(userId) {
    return await this.buildingModel
      .find({ createdBy: userId })
      .where({})
      .populate([])
      .select(this.getBuildingKeys());
  }
}
