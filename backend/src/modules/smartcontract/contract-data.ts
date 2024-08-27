export const serviceDeviceContractAddress =
  '0x2b746D228379F0E0a307723dF99486Dc17fdf9B1';
  
export const zkpContractAddress = '0xf1AdF8eD7569e0BceC73B371f4876Db69515CD20';

export const zkpContractABI = [
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

export const serviceDeviceContractABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'initialOwner',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'AccessManagers__IsAlreadyManager',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'AccessManagers__IsNotManager',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'addManager',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'nodeId',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'deviceId',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'ownerId',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'deviceType',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'encryptedID',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'hardwareVersion',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'firmwareVersion',
        type: 'string',
      },
      {
        internalType: 'string[]',
        name: 'parameters',
        type: 'string[]',
      },
      {
        internalType: 'string',
        name: 'useCost',
        type: 'string',
      },
      {
        internalType: 'string[]',
        name: 'locationGPS',
        type: 'string[]',
      },
      {
        internalType: 'string',
        name: 'installationDate',
        type: 'string',
      },
    ],
    name: 'createDevice',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'nodeId',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'serviceId',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'description',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'serviceType',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'devices',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'installationPrice',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'executionPrice',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'imageURL',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'program',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'creationDate',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'publishedDate',
        type: 'string',
      },
    ],
    name: 'createService',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'targetNodeId',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'targetDeviceId',
        type: 'string',
      },
    ],
    name: 'removeDevice',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'removeManager',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'targetNodeId',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'targetServiceId',
        type: 'string',
      },
    ],
    name: 'removeService',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'nodeId',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'serviceId',
        type: 'string',
      },
    ],
    name: 'ServiceMarket__DuplicatedId',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'nodeId',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'serviceId',
        type: 'string',
      },
    ],
    name: 'ServiceMarket__ServiceIdNotExist',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'nodeId',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'deviceId',
        type: 'string',
      },
    ],
    name: 'SharedDevice__DeviceIdNotExist',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'nodeId',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'deviceId',
        type: 'string',
      },
    ],
    name: 'SharedDevice__DuplicatedId',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'string',
            name: 'nodeId',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'deviceId',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'ownerId',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'deviceType',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'encryptedID',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'hardwareVersion',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'firmwareVersion',
            type: 'string',
          },
          {
            internalType: 'string[]',
            name: 'parameters',
            type: 'string[]',
          },
          {
            internalType: 'string',
            name: 'useCost',
            type: 'string',
          },
          {
            internalType: 'string[]',
            name: 'locationGPS',
            type: 'string[]',
          },
          {
            internalType: 'string',
            name: 'installationDate',
            type: 'string',
          },
        ],
        indexed: false,
        internalType: 'struct Device',
        name: 'device',
        type: 'tuple',
      },
    ],
    name: 'DeviceCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'string',
            name: 'nodeId',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'deviceId',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'ownerId',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'deviceType',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'encryptedID',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'hardwareVersion',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'firmwareVersion',
            type: 'string',
          },
          {
            internalType: 'string[]',
            name: 'parameters',
            type: 'string[]',
          },
          {
            internalType: 'string',
            name: 'useCost',
            type: 'string',
          },
          {
            internalType: 'string[]',
            name: 'locationGPS',
            type: 'string[]',
          },
          {
            internalType: 'string',
            name: 'installationDate',
            type: 'string',
          },
        ],
        indexed: false,
        internalType: 'struct Device',
        name: 'device',
        type: 'tuple',
      },
    ],
    name: 'DeviceRemoved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'string',
            name: 'nodeId',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'serviceId',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'description',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'serviceType',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'devices',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'installationPrice',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'executionPrice',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'imageURL',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'program',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'creationDate',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'publishedDate',
            type: 'string',
          },
        ],
        indexed: false,
        internalType: 'struct Service',
        name: 'service',
        type: 'tuple',
      },
    ],
    name: 'ServiceCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'string',
            name: 'nodeId',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'serviceId',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'description',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'serviceType',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'devices',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'installationPrice',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'executionPrice',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'imageURL',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'program',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'creationDate',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'publishedDate',
            type: 'string',
          },
        ],
        indexed: false,
        internalType: 'struct Service',
        name: 'service',
        type: 'tuple',
      },
    ],
    name: 'ServiceRemoved',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'fetchAllDevices',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'nodeId',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'deviceId',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'ownerId',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'deviceType',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'encryptedID',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'hardwareVersion',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'firmwareVersion',
            type: 'string',
          },
          {
            internalType: 'string[]',
            name: 'parameters',
            type: 'string[]',
          },
          {
            internalType: 'string',
            name: 'useCost',
            type: 'string',
          },
          {
            internalType: 'string[]',
            name: 'locationGPS',
            type: 'string[]',
          },
          {
            internalType: 'string',
            name: 'installationDate',
            type: 'string',
          },
        ],
        internalType: 'struct Device[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'fetchAllServices',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'nodeId',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'serviceId',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'description',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'serviceType',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'devices',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'installationPrice',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'executionPrice',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'imageURL',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'program',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'creationDate',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'publishedDate',
            type: 'string',
          },
        ],
        internalType: 'struct Service[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
