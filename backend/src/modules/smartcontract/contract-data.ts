import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import commitmentManagementABI from './ABI/CommitmentManagemantABI.json';
import deviceNftABI from './ABI/DeviceNFTABI.json';
import identityOwnershipRegisterationABI from './ABI/IdentityOwnershipRegisterationABI.json';
import serviceDeviceABI from './ABI/ServiceDeviceABI.json';
import zkpStorageABI from './ABI/ZKPStorageABI.json';

@Injectable()
export class ContractDataService {
  constructor(private configService: ConfigService) {}

  get serviceDeviceContractAddress(): string {
    return this.configService.get<string>('NODE_SERVICE_DEVICE_MANAGEMENT');
  }

  get storeZkpContractAddress(): string {
    return this.configService.get<string>('ZKP_STORAGE');
  }

  get commitmentContractAddress(): string {
    return this.configService.get<string>('COMMITMENT_MANAGEMENT');
  }

  get deviceNftContractAddress(): string {
    return this.configService.get<string>('DEVICE_NFT_MANAGEMENT');
  }

  get identityOwnershipRegisterationContractAddress(): string {
    return this.configService.get<string>('IDENTITY_OWNERSHIP_REGISTERATION');
  }
}

export {
  commitmentManagementABI,
  deviceNftABI,
  identityOwnershipRegisterationABI,
  serviceDeviceABI,
  zkpStorageABI,
};
