import { Injectable } from '@nestjs/common';
import { BuildingRepository } from './building.repository';
import { CreateBuildingRequestBodyDto } from '../dto/building.dto';
import { BuildingSchema } from './building.schema';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';

@Injectable()
export class BuildingService {
  constructor(private buildingRepository?: BuildingRepository) {}

  getBuildingKeys(): string[] {
    return Object.keys(BuildingSchema.paths);
  }

  async addNewBuilding(data: CreateBuildingRequestBodyDto, createdBy: string) {
    const insertData = {
      ...data,
      createdBy: createdBy,
      insertDate: new Date(),
      updateDate: new Date(),
    };

    return this.buildingRepository.insertBuilding(insertData);
  }

  async createDefaultBuilding(userId: string) {
    const defBuild = {
      name: 'Tower 1',
      details: {
        floor_6: {
          name: '',
          units: {
            unit_1: {
              name: '',
              device: '',
            },
            unit_2: {
              name: '',
              device: '',
            },
          },
        },
        floor_5: {
          name: '',
          units: {
            unit_1: {
              name: '',
              device: '',
            },
            unit_2: {
              name: '',
              device: '',
            },
          },
        },
        floor_4: {
          name: '',
          units: {
            unit_1: {
              name: '',
              device: '',
            },
            unit_2: {
              name: '',
              device: '',
            },
          },
        },
        floor_3: {
          name: '',
          units: {
            unit_1: {
              name: '',
              device: '',
            },
            unit_2: {
              name: '',
              device: '',
            },
          },
        },
        floor_2: {
          name: '',
          units: {
            unit_1: {
              name: '',
              device: '',
            },
            unit_2: {
              name: '',
              device: '',
            },
          },
        },
        floor_1: {
          name: '',
          units: {
            unit_1: {
              name: '',
              device: '',
            },
            unit_2: {
              name: '',
              device: '',
            },
          },
        },
      },
    };

    this.addNewBuilding(defBuild, userId);
  }

  async getAllBuildings() {
    return this.buildingRepository.getAllBuildings();
  }

  async getAllBuildingsByUserId(userId) {
    return this.buildingRepository.getBuildingsByUserId(userId);
  }

  async getBuildingOwnerByBuildId(buildId) {
    const res = await this.buildingRepository.getBuildingByBuildId(buildId);
    return res.createdBy.toString();
  }

  async deleteBuildingByBuildId(buildId, isAdmin, userId) {
    const buildOwner = await this.getBuildingOwnerByBuildId(buildId);
    if (isAdmin == false && buildOwner !== userId.toString()) {
      throw new GeneralException(ErrorTypeEnum.FORBIDDEN, 'Access Denied.');
    }
    return this.buildingRepository.deleteBuildingByBuildId(buildId);
  }

  async getBuildingByBuildId(buildId, isAdmin, userId) {
    const buildOwner = await this.getBuildingOwnerByBuildId(buildId);
    if (isAdmin == false && buildOwner !== userId.toString()) {
      throw new GeneralException(ErrorTypeEnum.FORBIDDEN, 'Access Denied.');
    }
    return this.buildingRepository.getBuildingByBuildId(buildId);
  }

  async editBuildingByBuildId(buildId, data, isAdmin, userId) {
    const buildOwner = await this.getBuildingOwnerByBuildId(buildId);
    if (isAdmin == false && buildOwner !== userId.toString()) {
      throw new GeneralException(ErrorTypeEnum.FORBIDDEN, 'Access Denied.');
    }
    return this.buildingRepository.editBuildingById(buildId, data);
  }

  async deleteDeviceIdFromAllBuildings(deviceId: string) {
    return this.buildingRepository.deleteDeviceIdFromAllBuildings(deviceId);
  }

  async deleteDeviceIdFromBuildingsByUserId(deviceId: string, userId: string) {
    console.log("Gholllllllllllll 111111111111111111111")
    return this.buildingRepository.deleteDeviceIdFromBuildingsByUserId(deviceId, userId);
  }
}
