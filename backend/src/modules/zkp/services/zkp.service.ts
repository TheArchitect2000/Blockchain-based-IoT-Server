import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

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
export class ZkpService {
  private readonly rpcUrl = 'https://fidesf1-rpc.fidesinnova.io';
  private readonly chainId = 706883;
  private readonly contractAddress =
    '0xf1AdF8eD7569e0BceC73B371f4876Db69515CD20';
  private readonly contractABI = [
    {
      inputs: [
        {
          internalType: 'uint256[2]',
          name: '_pA',
          type: 'uint256[2]',
        },
        {
          internalType: 'uint256[2][2]',
          name: '_pB',
          type: 'uint256[2][2]',
        },
        {
          internalType: 'uint256[2]',
          name: '_pC',
          type: 'uint256[2]',
        },
        {
          internalType: 'uint256[1]',
          name: '_pubSignals',
          type: 'uint256[1]',
        },
      ],
      name: 'verifyProof',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ];

  private provider: any;
  private wallet: any;
  private contract: any;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(this.rpcUrl, {
      name: 'FidesInnova',
      chainId: this.chainId,
    });
    
    this.wallet = new ethers.Wallet(
      '812c3d58559a4d5e914d478599e26bd684e6f4e191ab989e26466a41945e99e7',
      this.provider,
    );
    this.contract = new ethers.Contract(
      this.contractAddress,
      this.contractABI,
      this.wallet,
    );

    this.zpkProof = this.zpkProof.bind(this);

    // Debug: log the contract to ensure it has the verifyProof method
    console.log('Contract Methods:', this.contract.functions);
  }

  async zpkProof(proofString: string): Promise<boolean> {
    try {
      const proofSlices = parseProofString(proofString);
      const result = await this.contract.verifyProof(
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

/* zkpController.zkpRequestService

zkpController.verfiyProof */
