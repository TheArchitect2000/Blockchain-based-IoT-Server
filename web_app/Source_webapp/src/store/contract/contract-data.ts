export const storeZkpContractAddress =
    '0x731b6c8d68ca98e0ab0592fdb1749c1d2f2ac504'

export const commitmentContractAddress =
    '0x9d7704502745723cf7363268ad7aac54e9c3a093'

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
]

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
]
