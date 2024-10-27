import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { BuildingModel } from './building.model';
import { BuildingSchema } from './building.schema';
import { Types } from 'mongoose';

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
        throw new GeneralException(
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
      throw new GeneralException(
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
        throw new GeneralException(ErrorTypeEnum.NOT_FOUND, errorMessage);
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

  async deleteDeviceIdFromAllBuildings(deviceId: string) {
    const buildings = await this.buildingModel.find({
      details: { $exists: true },
    });

    for (const building of buildings) {
      let modified = false;

      for (const floorKey in building.details) {
        const floor = building.details[floorKey];

        for (const unitKey in floor.units) {
          if (floor.units[unitKey].device === deviceId) {
            floor.units[unitKey].device = '';
            modified = true;
          }
        }
      }

      if (modified) {
        // Mark details as modified
        building.markModified('details');

        // Save the modified building document
        await building.save();
      }
    }
  }

  async deleteDeviceIdFromBuildingsByUserId(deviceId: string, userId: string) {
    const createdBy = new Types.ObjectId(userId);

    // Check if buildings exist for the given user
    const buildingsExist = await this.buildingModel.exists({
      createdBy: createdBy,
      details: { $exists: true },
    });
    if (!buildingsExist) {
      console.log(`No buildings found for user: ${userId}`);
      return;
    }

    const buildings = await this.buildingModel.find({
      createdBy: createdBy,
      details: { $exists: true },
    });

    for (const building of buildings) {
      let modified = false;

      for (const floorKey in building.details) {
        const floor = building.details[floorKey];

        for (const unitKey in floor.units) {
          if (floor.units[unitKey].device === deviceId) {
            floor.units[unitKey].device = '';
            modified = true;
          }
        }
      }

      if (modified) {
        // Mark details as modified
        building.markModified('details');

        // Save the modified building document
        await building.save();
      }
    }
  }
}
