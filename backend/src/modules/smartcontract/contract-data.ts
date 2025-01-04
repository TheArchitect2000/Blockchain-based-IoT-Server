export const serviceDeviceContractAddress =
  '0x0caf2cdaefa7a2c553f1fe45add08d812dacc35e';

export const zkpContractAddress = '0xf1AdF8eD7569e0BceC73B371f4876Db69515CD20';

export const storeZkpContractAddress =
  '0x731b6c8d68ca98e0ab0592fdb1749c1d2f2ac504';

export const commitmentContractAddress =
  '0x9d7704502745723cf7363268ad7aac54e9c3a093';

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

export const storeZkpContractABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'deleteZKP',
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
        name: 'deviceType',
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
        internalType: 'string',
        name: 'data_payload',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'unixtime_payload',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'zkp_payload',
        type: 'string',
      },
    ],
    name: 'storeZKP',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    name: 'ZKPDeleted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'nodeId',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'deviceId',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'deviceType',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'hardwareVersion',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'firmwareVersion',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'data_payload',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'zkp_payload',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'unixtime_payload',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    name: 'ZKPStored',
    type: 'event',
  },
  {
    inputs: [],
    name: 'fetchAllZKP',
    outputs: [
      {
        internalType: 'string[]',
        name: 'nodeIds',
        type: 'string[]',
      },
      {
        internalType: 'string[]',
        name: 'deviceIds',
        type: 'string[]',
      },
      {
        internalType: 'string[]',
        name: 'deviceTypes',
        type: 'string[]',
      },
      {
        internalType: 'string[]',
        name: 'hardwareVersions',
        type: 'string[]',
      },
      {
        internalType: 'string[]',
        name: 'firmwareVersions',
        type: 'string[]',
      },
      {
        internalType: 'string[]',
        name: 'zkp_payloads',
        type: 'string[]',
      },
      {
        internalType: 'string[]',
        name: 'data_payloads',
        type: 'string[]',
      },
      {
        internalType: 'string[]',
        name: 'unixtime_payloads',
        type: 'string[]',
      },
      {
        internalType: 'uint256[]',
        name: 'timestamps',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'getZKP',
    outputs: [
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
        name: 'deviceType',
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
        internalType: 'string',
        name: 'zkp_payload',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'data_payload',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'unixtime_payload',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getZKPCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'zkps',
    outputs: [
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
        name: 'deviceType',
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
        internalType: 'string',
        name: 'data_payload',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'zkp_payload',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'unixtime_payload',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export const commitmentContractABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'commitmentID',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'nodeId',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    name: 'CommitmentRemoved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'commitmentID',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'nodeId',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'iot_manufacturer_name',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'iot_device_name',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'device_hardware_version',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'firmware_version',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'commitmentData',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    name: 'CommitmentStored',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'commitmentID',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'nodeId',
        type: 'string',
      },
    ],
    name: 'removeCommitment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'commitmentID',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'nodeId',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'iot_manufacturer_name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'iot_device_name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'device_hardware_version',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'firmware_version',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'commitmentData',
        type: 'string',
      },
    ],
    name: 'storeCommitment',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    name: 'commitmentIDs',
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
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'commitments',
    outputs: [
      {
        internalType: 'string',
        name: 'commitmentID',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'nodeId',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'iot_manufacturer_name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'iot_device_name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'device_hardware_version',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'firmware_version',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'commitmentData',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'commitmentID',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'nodeId',
        type: 'string',
      },
    ],
    name: 'getCommitment',
    outputs: [
      {
        internalType: 'string',
        name: 'commitmentIDResult',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'nodeIdResult',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'iot_manufacturer_name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'iot_device_name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'device_hardware_version',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'firmware_version',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'commitmentData',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCommitmentCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
