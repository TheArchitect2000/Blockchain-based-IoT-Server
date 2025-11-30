import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import {
  AbiCoder,
  ContractTransaction,
  ethers,
  id as keccakId,
  Log,
} from 'ethers';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { DeviceService } from 'src/modules/device/services/device.service';
import { ServiceService } from 'src/modules/service/services/service.service';
import { StoreCommitmentData } from '../dto/contract-dto';
import { ContractRepository } from '../repository/contract.repository';
import { ContractDataService } from '../contract-data';
import { Cron, Interval } from '@nestjs/schedule';

// Import JSON files with type assertions
const serviceDeviceABI = require('../ABI/ServiceDeviceABI.json') as any[];
const zkpStorageABI = require('../ABI/ZKPStorageABI.json') as any[];
const commitmentManagementABI =
  require('../ABI/CommitmentManagemantABI.json') as any[];

function decodeRevertData(data: string, types: string[]) {
  if (!data || data === '0x') return null;
  // drop selector (first 4 bytes = 10 chars including '0x')
  const encodedArgs = '0x' + data.slice(10);
  const coder = new AbiCoder();
  try {
    return coder.decode(types, encodedArgs);
  } catch (err) {
    return null;
  }
}

// build selector -> error signature map from ABI JSON (errors only)
function buildErrorSelectorMapFromAbi(abi: any[]): Record<string, string> {
  const map: Record<string, string> = {};
  const errors = abi.filter((item) => item.type === 'error');
  for (const e of errors) {
    const types = (e.inputs || []).map((i) => i.type).join(',');
    const signature = `${e.name}(${types})`;
    const selector = keccakId(signature).slice(0, 10); // 0x + 8 hex chars
    map[selector] = signature;
  }
  return map;
}

// try to decode unknown custom error using ABI (if available) or using common fallback ["address","string"]
function decodeCustomError(
  data: string,
  abiList: any[] = [],
):
  | { selector: string; signature?: string; decoded?: any }
  | { selector: string; raw: string } {
  if (!data || data === '0x') return { selector: '0x' };

  const selector = data.slice(0, 10);

  // 1) try all provided ABIs for matching error signature
  for (const abi of abiList) {
    const map = buildErrorSelectorMapFromAbi(abi);
    if (map[selector]) {
      // we have the signature, get types
      const signature = map[selector]; // e.g. "NotAuthorized(address,string)"
      const typesPart = signature.replace(/^[^\(]+\(|\)$/g, ''); // "address,string"
      const types = typesPart === '' ? [] : typesPart.split(',');
      const decoded = types.length ? decodeRevertData(data, types) : null;
      return { selector, signature, decoded };
    }
  }

  // 2) fallback: attempt common pattern (address, string)
  const fallbackTypes = ['address', 'string'];
  const decoded = decodeRevertData(data, fallbackTypes);
  if (decoded) {
    return { selector, signature: 'unknown(address,string)', decoded };
  }

  // 3) nothing matched, return raw
  return { selector, raw: data };
}

function parseProofString(proofString) {
  let cleanedString = proofString.substring(1, proofString.length - 1);
  let sections = cleanedString.split('],[');
  return sections.map((section) => {
    section = section.replace(/^\[|\]$/g, '');
    return section.split(',').map((item) => item.trim().replace(/^'|'$/g, ''));
  });

  interface StoreCommitmentData {
    commitmentID: string;
    manufacturerName: string;
    deviceName: string;
    hardwareVersion: string;
    firmwareVersion: string;
    commitmentData: string;
  }

  interface StoreCommitmentResponse {
    success: boolean;
    transactionId?: string;
    error?: string;
  }
}

@Injectable()
export class ContractService {
  private readonly rpcUrl = process.env.RPC_URL;
  private readonly chainId = 706883;
  private readonly faucetAmount = 5;
  private readonly minFaucetAmount = 0.5;
  private lastRequestTime = {};
  private provider: any;
  private faucetWallet: any;
  private adminWallet: any;
  private contracts = {
    zkp: null,
    serviceDevice: null,
    storeZkp: null,
    commitment: null,
    identityOwnershipRegisteration: null,
    deviceNft: null,
  };

  constructor(
    private readonly contractRepository?: ContractRepository,
    @Inject(forwardRef(() => DeviceService))
    private readonly deviceService?: DeviceService,
    @Inject(forwardRef(() => ServiceService))
    private readonly serviceService?: ServiceService,
    private readonly contractData?: ContractDataService,
  ) {
    try {
      this.provider = new ethers.JsonRpcProvider(this.rpcUrl, {
        name: 'FidesInnova',
        chainId: this.chainId,
      });

      // Add error handlers to prevent crashes
      this.provider.on('error', (error) => {
        console.error('RPC Provider Error:', error.message);
        // Don't crash - just log the error
      });

      // Try to get network info, but don't crash if it fails
      this.provider.getNetwork().catch((error) => {
        console.error(
          'RPC Provider: Failed to get network info:',
          error.message,
        );
      });
    } catch (error) {
      console.error('Failed to initialize RPC Provider:', error.message);
      // Create a dummy provider to prevent null reference errors
      // The service will need to handle this gracefully
      this.provider = null;
    }

    // Only create wallets if provider is available
    if (this.provider) {
      try {
        this.faucetWallet = new ethers.Wallet(
          process.env.FAUCET_WALLET_PRIVATE_KEY,
          this.provider,
        );

        this.adminWallet = new ethers.Wallet(
          process.env.ADMIN_WALLET_PRIVATE_KEY,
          this.provider,
        );
      } catch (error) {
        console.error('Failed to create wallets:', error.message);
      }
    }

    // Only create contracts if provider and wallets are available
    if (
      this.provider &&
      this.adminWallet &&
      this.contractData?.serviceDeviceContractAddress
    ) {
      try {
        this.contracts.serviceDevice = new ethers.Contract(
          this.contractData.serviceDeviceContractAddress,
          serviceDeviceABI,
          this.adminWallet,
        );
      } catch (error) {
        console.error(
          'Failed to create serviceDevice contract:',
          error.message,
        );
      }
    }

    if (this.provider && this.adminWallet) {
      try {
        this.contracts.storeZkp = new ethers.Contract(
          this.contractData.storeZkpContractAddress,
          zkpStorageABI,
          this.adminWallet,
        );
      } catch (error) {
        console.error('Failed to create storeZkp contract:', error.message);
      }

      try {
        this.contracts.commitment = new ethers.Contract(
          this.contractData.commitmentContractAddress,
          commitmentManagementABI,
          this.adminWallet,
        );
      } catch (error) {
        console.error('Failed to create commitment contract:', error.message);
      }
    }

    // Only set up event listeners if contracts are available
    if (this.contracts.serviceDevice) {
      try {
        this.contracts.serviceDevice.on(
          'ServiceCreated',
          async (id, service) => {
            let newService = {
              nodeId: service[0],
              nodeServiceId: service[1],
              userId: service[1],
              serviceName: service[2],
              description: service[3],
              serviceImage: service[8],
              serviceType: service[4],
              installationPrice: service[6],
              runningPrice: service[7],
              status: 'tested',
              blocklyJson: '',
              code: service[9],
              devices: JSON.parse(service[5]),
              insertDate: service[10],
              updateDate: service[11],
              published: true,
            };

            try {
              const createService = await this.serviceService.insertService(
                newService,
              );
            } catch (error) {
              console.error('error: ', error);
            }
          },
        );

        this.contracts.serviceDevice.on(
          'ServiceRemoved',
          async (id, service) => {
            try {
              await this.serviceService.deleteServiceByNodeServiceIdAndNodeId(
                service[0],
                service[1],
              );
            } catch (error) {
              console.error(error);
            }
          },
        );

        this.contracts.serviceDevice.on('DeviceCreated', (id, device) => {
          try {
            let newDevice = {
              nodeId: device[0],
              nodeDeviceId: device[1],
              isShared: true,
              deviceName: device[2],
              deviceType: device[2],
              deviceEncryptedId: device[3],
              mac: Buffer.from(device[3], 'base64').toString('utf8'),
              hardwareVersion: String(device[4]).split('/')[0],
              firmwareVersion: String(device[4]).split('/')[1],
              parameters: device[6].map((str) => JSON.parse(str)),
              costOfUse: device[7],
              location: { coordinates: device[8] },
              insertDate: new Date(String(device[10])),
              updateDate: new Date(String(device[10])),
            };

            this.deviceService.insertDevice(newDevice);
          } catch (error) {
            console.error('DeviceCreated', error);
          }
        });

        this.contracts.serviceDevice.on('DeviceRemoved', (id, device) => {
          this.deviceService.deleteOtherNodeDeviceByNodeIdAndDeviceId(
            device[0],
            device[1],
            device[3],
          );
        });
      } catch (error) {
        console.error(
          'Failed to set up contract event listeners:',
          error.message,
        );
      }
    }
  }

  async adminWalletData() {
    return {
      address: this.adminWallet.address,
      balance: await this.getWalletBalance(this.adminWallet.address),
    };
  }

  async faucetWalletData() {
    return {
      address: this.faucetWallet.address,
      balance: await this.getWalletBalance(this.faucetWallet.address),
    };
  }

  formatBigInt(bigIntValue: bigint): number {
    if (bigIntValue === 0n) {
      return 0;
    }
    const divisor = 1000000000000000000n;
    const result = Number(bigIntValue) / Number(divisor);
    return Number(result.toFixed(5));
  }

  async getWalletBalance(walletAddress: string) {
    try {
      const res = await this.provider.getBalance(walletAddress);
      return this.formatBigInt(res);
    } catch (error) {
      return null;
    }
  }

  async requestFaucet(walletAddress: string): Promise<string> {
    const currentTime = Date.now();
    const twentyFourHours = 1000 * 24 * 60 * 60;

    if (
      this.lastRequestTime[walletAddress] &&
      currentTime - this.lastRequestTime[walletAddress] < twentyFourHours
    ) {
      throw new GeneralException(
        ErrorTypeEnum.FORBIDDEN,
        `You can only use the faucet once every 24 hours.`,
      );
    }

    const balance = await this.getWalletBalance(walletAddress);

    if (balance < this.faucetAmount) {
      const amountToSend = this.faucetAmount - balance;

      if (amountToSend < this.minFaucetAmount) {
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          `Minimum amount for faucet is ${this.minFaucetAmount}`,
        );
      }

      try {
        const tx = await this.faucetWallet.sendTransaction({
          to: walletAddress,
          value: ethers.parseUnits(amountToSend.toString(), 'ether'),
        });

        await tx.wait();

        this.lastRequestTime[walletAddress] = currentTime;
      } catch (error) {
        throw new GeneralException(
          ErrorTypeEnum.NOT_FOUND,
          'Wallet address is not valid !',
        );
      }

      return `Success: Topped up ${amountToSend} FDS to ${walletAddress}.`;
    }

    throw new GeneralException(
      ErrorTypeEnum.INTERNAL_SERVER_ERROR,
      `already has a balance of ${this.faucetAmount} FDS or more.`,
    );
  }

  async shareDevice(
    nodeId: string,
    deviceId: string,
    deviceType: string,
    encryptedID: string,
    hardwareVersion: string,
    firmwareVersion: string,
    parameters: Array<string>,
    useCost: string,
    locationGPS: Array<string>,
    installationDate: string,
  ) {
    try {
      const tx = await this.contracts.serviceDevice.createDevice(
        nodeId,
        deviceId,
        deviceType,
        encryptedID,
        `${firmwareVersion}/${hardwareVersion}`,
        'FidesInnova',
        parameters,
        useCost,
        locationGPS,
        'ownerShipId',
        installationDate,
        firmwareVersion,
      );

      await tx.wait();
      return tx.hash;
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred.';
      if (error?.code === 'CALL_EXCEPTION') {
        const revertData =
          error?.data || (error?.error && error.error.data) || null;
        if (revertData) {
          const decoded = decodeCustomError(revertData, [serviceDeviceABI]);
          if ('decoded' in decoded && decoded.decoded) {
            const values = decoded.decoded;
            errorMessage = `Smart contract reverted: selector=${
              decoded.selector
            }, signature=${decoded.signature ?? 'unknown'}, user=${
              values[0]
            }, reason=${values[1]}`;
          }
        }
      }
      throw new GeneralException(
        ErrorTypeEnum.INTERNAL_SERVER_ERROR,
        errorMessage,
      );
    }
  }
  async removeSharedDevice(nodeId: string, deviceId: string) {
    return this.contracts.serviceDevice.removeDevice(nodeId, deviceId, nodeId);
  }

  async createService(
    nodeId: string,
    serviceId: string,
    name: string,
    description: string,
    serviceType: string,
    devices: string,
    installationPrice: string,
    executionPrice: string,
    imageURL: string,
    program: string,
    creationDate: string,
    publishedDate: string,
  ) {
    try {
      return this.contracts.serviceDevice.createService(
        nodeId,
        serviceId,
        name,
        description,
        serviceType,
        devices,
        installationPrice,
        executionPrice,
        imageURL,
        program,
        creationDate,
        publishedDate,
      );
    } catch (error) {
      console.error('Error While publishing service:', error);
    }
  }

  async removeService(nodeId: string, serviceId: string) {
    return this.contracts.serviceDevice.removeService(
      nodeId,
      serviceId,
      nodeId,
    );
  }

  async fetchAllDevices() {
    return this.contracts.serviceDevice.fetchAllDevices();
  }

  async fetchAllServices() {
    return this.contracts.serviceDevice.fetchAllServices();
  }

  async syncAllServices() {
    const allContractServices = await this.fetchAllServices();
    const allNodeServices = await this.serviceService.getAllPublishedServices();

    allNodeServices.map((nodeServices: any) => {
      let exist = false;
      allContractServices.map((contractServices: any) => {
        if (
          String(nodeServices.nodeId) == String(contractServices[0]) &&
          (String(nodeServices.nodeServiceId) == String(contractServices[1]) ||
            String(nodeServices._id) == String(contractServices[1]))
        ) {
          exist = true;
        }
      });
      if (exist == false) {
        try {
          this.serviceService.deleteServiceByNodeServiceIdAndNodeId(
            nodeServices.nodeId,
            nodeServices.nodeServiceId,
          );
        } catch (error) {
          console.error(error);
        }
      }
    });

    allContractServices.map((contractServices: any) => {
      let exist = false;
      allNodeServices.map((nodeServices: any) => {
        if (
          String(nodeServices.nodeId) == String(contractServices[0]) &&
          (String(nodeServices.nodeServiceId) == String(contractServices[1]) ||
            String(nodeServices._id) == String(contractServices[1]))
        ) {
          exist = true;
        }
      });
      if (exist == false) {
        let newService = {
          nodeId: contractServices[0],
          nodeServiceId: contractServices[1],
          userId: contractServices[1],
          serviceName: contractServices[2],
          description: contractServices[3],
          serviceImage: contractServices[8],
          serviceType: contractServices[4],
          installationPrice: contractServices[6],
          runningPrice: contractServices[7],
          status: 'tested',
          blocklyJson: '',
          code: contractServices[9],
          devices: JSON.parse(contractServices[5]),
          insertDate: contractServices[10],
          updateDate: contractServices[11],
          published: true,
        };
        try {
          this.serviceService.insertService(newService);
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  @Cron('0 2 * * *')
  async handleSyncAllDevicesCron() {
    await this.syncAllSharedDevices();
    await this.removeUnsharedDevices();
  }

  async syncAllSharedDevices() {
    const allContractDevices = await this.fetchAllDevices();
    const allNodeDevices = await this.deviceService.getAllSharedDevices();

    allNodeDevices.map(async (nodeDevices: any) => {
      let isExist = false;
      allContractDevices.map((contractDevices: any) => {
        if (
          String(nodeDevices.deviceEncryptedId) === String(contractDevices[1])
        ) {
          isExist = true;
        }
      });
      if (!isExist) {
        await this.deviceService.unshareBySystem(nodeDevices._id);
      }
    });
  }

  /**
   * when a device doesnt share in db, remove it from blockchain
   */
  async removeUnsharedDevices() {
    const allContractDevices = await this.fetchAllDevices();
    for (const contract of allContractDevices) {
      const device = await this.deviceService.getDeviceByEncryptedId(
        contract[3],
      );

      if (!device || !device.isShared) {
        await this.removeSharedDevice(contract[0], contract[3]);
      }
    }
  }

  async unshareIncorrectNodeIdDevices() {
    const allContractDevices = await this.fetchAllDevices();
    for (const contract of allContractDevices) {
      const device = await this.deviceService.getDeviceByEncryptedId(
        contract[3],
      );
      if (device && device.nodeId !== String(contract[0])) {
        await this.deviceService.unshareBySystem(device._id);
      }
    }
  }

  async storeZKP(
    nodeId: string,
    deviceId: string,
    zkp_payload: string,
    data_payload: string,
  ) {
    const unixTimestamp = Math.floor(Date.now() / 1000);

    return await this.contracts.storeZkp.storeZKP(
      nodeId,
      deviceId,
      zkp_payload,
      data_payload,
      String(unixTimestamp),
    );
  }

  async storeCommitment(data: StoreCommitmentData): Promise<any> {
    try {
      const {
        commitmentID,
        manufacturer,
        deviceType,
        deviceIdType,
        deviceModel,
        softwareVersion,
        commitmentData,
        frontPublish,
        transactionId,
      } = data;

      let txHash = '';

      if (!frontPublish) {
        try {
          const tx: any = await this.contracts.commitment.storeCommitment(
            commitmentID,
            process.env.NODE_NAME,
            deviceType,
            deviceIdType,
            deviceModel,
            manufacturer,
            softwareVersion,
            commitmentData,
            Math.floor(Date.now() / 1000),
          );

          txHash = tx.hash;
        } catch (error) {
          console.error('Storing commitment Error:', error);
        }
      }

      // Save commitment data to the database
      await this.saveCommitmentInDB({
        ...data,
        transactionId: transactionId ? transactionId : txHash,
      });

      return txHash;
    } catch (error: any) {
      // Handle different types of errors
      let errorMessage = 'An unexpected error occurred.';

      if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = 'Transaction failed due to insufficient funds.';
      } else if (error.code === 'CALL_EXCEPTION') {
        errorMessage = 'Smart contract execution reverted.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      //console.error(`Error in storeCommitment: ${errorMessage}`, error);

      // Optionally, you can log the error to an external monitoring service here

      // Return the error message to the front-end
      throw new GeneralException(
        ErrorTypeEnum.INTERNAL_SERVER_ERROR,
        errorMessage,
      );
    }
  }

  async removeCommitment(commitmentId: string, dbId: string, nodeId: string) {
    try {
      const commitmentDb =
        await this.contractRepository.getCommitmentByCommitmentIdAndNodeId(
          dbId,
          nodeId,
        );

      if (commitmentDb) {
        const result = await this.contracts.commitment.removeCommitment(
          commitmentId,
          nodeId,
        );

        await this.contractRepository.deleteCommitmentByCommitmentIdAndNodeId(
          dbId,
          nodeId,
        );

        return result;
      } else {
        throw new GeneralException(
          ErrorTypeEnum.NOT_FOUND,
          `Commitment not found.`,
        );
      }
    } catch (error) {
      console.error('removeCommitment error:', error);
    }
  }

  async zpkProof(proofString: string): Promise<boolean> {
    try {
      /* const proofSlices = parseProofString(proofString);
      const result = await this.contracts.zkp.verifyProof(
        proofSlices[0],
        [proofSlices[1], proofSlices[2]],
        proofSlices[3],
        proofSlices[4],
      ); */
      return false;
    } catch (error) {
      console.error('Error calling verifyProof:', error);
      return false;
    }
  }

  async saveCommitmentInDB(data: StoreCommitmentData) {
    return await this.contractRepository.saveCommitment({
      transactionId: data.transactionId,
      commitmentId: data.commitmentID,
      nodeId: process.env.NODE_NAME,
      userId: data.userId,
      manufacturer: data.manufacturer,
      deviceType: data.deviceType,
      deviceIdType: data.deviceIdType,
      deviceModel: data.deviceModel,
      softwareVersion: data.softwareVersion,
      commitmentData: data.commitmentData,
    });
  }

  async getCommitmentsByUserId(userId: string) {
    return await this.contractRepository.getCommitmentsByUserId(userId);
  }
}
