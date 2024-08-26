import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as contractData from '../contract-data';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';

function parseProofString(proofString) {
  // Remove the outermost square brackets
  let cleanedString = proofString.substring(1, proofString.length - 1);

  // Split by '],[' to separate main array elements
  let sections = cleanedString.split('],[');

  // Process each section to remove remaining brackets and split by ','
  return sections.map((section) => {
    // Remove remaining brackets if present
    section = section.replace(/^\[|\]$/g, '');

    // Split by ',' and trim each element
    return section.split(',').map((item) => item.trim().replace(/^'|'$/g, ''));
  });
}

@Injectable()
export class ContractService {
  private readonly rpcUrl = 'https://fidesf1-rpc.fidesinnova.io';
  private readonly chainId = 706883;
  private readonly faucetAmount = 5;
  private readonly minFaucetAmount = 0.5;
  private lastRequestTime = {};
  private provider: any;
  private wallet: any;
  private contracts = {
    zkp: null,
    serviceDevice: null,
  };

  constructor() {
    this.provider = new ethers.JsonRpcProvider(this.rpcUrl, {
      name: 'FidesInnova',
      chainId: this.chainId,
    });

    this.wallet = new ethers.Wallet(
      process.env.FAUCET_WALLET_PRIVATE_KEY,
      this.provider,
    );

    this.contracts.zkp = new ethers.Contract(
      contractData.zkpContractAddress,
      contractData.zkpContractABI,
      this.wallet,
    );

    this.contracts.serviceDevice = new ethers.Contract(
      contractData.serviceDeviceContractAddress,
      contractData.serviceDeviceContractABI,
      this.wallet,
    );
  }

  formatBigInt(bigIntValue: bigint): number {
    let strValue = bigIntValue.toString().replace(/0+$/, '');
    let formattedValue = strValue.slice(0, 1) + '.' + strValue.slice(1, 8);
    return parseFloat(formattedValue);
  }

  async getWalletBalance(walletAddress: string) {
    try {
      const res = await this.provider.getBalance(walletAddress);
      return this.formatBigInt(res);
    } catch (error) {
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        `Wallet address is not valid !`,
      );
    }
  }

  async requestFaucet(walletAddress: string): Promise<string> {
    const currentTime = Date.now();
    const twentyFourHours = 1000 * 24 * 60 * 60;

    console.log(
      'time remaining:',
      currentTime - this.lastRequestTime[walletAddress],
    );

    if (
      this.lastRequestTime[walletAddress] &&
      currentTime - this.lastRequestTime[walletAddress] < twentyFourHours
    ) {
      throw new GeneralException(
        ErrorTypeEnum.FORBIDDEN,
        `You can only use the faucet once every 24 hours.`,
      );
    }

    this.lastRequestTime[walletAddress] = currentTime;

    const balance = this.formatBigInt(
      await this.provider.getBalance(walletAddress),
    );

    console.log('Balanceee:', balance);
    console.log('faucetAmounttttt:', this.faucetAmount);

    if (balance < this.faucetAmount) {
      const amountToSend = this.faucetAmount - balance;

      if (amountToSend < this.minFaucetAmount) {
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          `Minimum amount for faucet is ${this.minFaucetAmount}`,
        );
      }

      try {
        const tx = await this.wallet.sendTransaction({
          to: walletAddress,
          value: ethers.parseUnits(amountToSend.toString(), 'ether'),
        });

        await tx.wait();
      } catch (error) {
        throw new GeneralException(
          ErrorTypeEnum.NOT_FOUND,
          'Wallet address is not valid !',
        );
      }

      return `Success: Topped up ${amountToSend} FDS to ${walletAddress}.`;
    }

    return `No action needed: ${walletAddress} already has a balance of 5 FDS or more.`;
  }

  async serviceCreate() {
    return this.contracts.serviceDevice.removeDevice('nodeId', 'deviceId');
    /* return this.contracts.serviceDevice.createDevice(
      'nodeId',
      'deviceId',
      'ownerId',
      'name',
      'deviceType',
      'encryptedID',
      'hardwareVersion',
      'firmwareVersion',
      ['parameters'],
      'useCost',
      ['locationGPS'],
      'installationDate',
    ); */
  }
  async fetchService() {
    //return this.contracts.serviceDevice.removeService('nodeId', 'serviceId');
    return this.contracts.serviceDevice.fetchAllDevices();
  }

  async zpkProof(proofString: string): Promise<boolean> {
    try {
      const proofSlices = parseProofString(proofString);
      const result = await this.contracts.zkp.verifyProof(
        proofSlices[0],
        [proofSlices[1], proofSlices[2]],
        proofSlices[3],
        proofSlices[4],
      );
      return result;
    } catch (error) {
      console.error('Error calling verifyProof:', error);
      return false;
    }
  }
}
