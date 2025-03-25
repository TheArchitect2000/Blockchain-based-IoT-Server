import { apiGetMyProfile } from '@/services/UserApi'
import { useAppKitAccount } from '@reown/appkit-core/react'
import { useAppKitProvider } from '@reown/appkit/react'
import { BrowserProvider, Contract, ethers, JsonRpcProvider } from 'ethers'
import { create } from 'zustand'
import * as ContractData from './contract-data'
import { toast, Notification } from '@/components/ui'

interface ContractStore {
    loading: boolean
    zkpContract: Contract
    commitmentContract: Contract
    identityOwnershipRegisterationContract: Contract
    deviceNFTManagemantContract: Contract
    getErrorMessage: (error: any) => string
    RegisterIdentity: (
        nodeId: string
    ) => Promise<{ status: boolean; tx?: any; error?: string }>
    RegisterOwnership: (
        identityAddress: string
    ) => Promise<{ status: boolean; tx?: any; error?: string }>
    storeZKP: (
        nodeId: string,
        deviceId: string,
        deviceType: string,
        hardwareVersion: string,
        firmwareVersion: string,
        data_payload: string,
        zkp_payload: string
    ) => Promise<boolean | string>
    storeCommitment: (
        commitmentID: string,
        nodeId: string,
        manufacturerName: string,
        deviceName: string,
        hardwareVersion: string,
        firmwareVersion: string,
        commitmentData: string
    ) => Promise<boolean | string>
    bindIdentityOwnership: (
        ownershipAddress: string
    ) => Promise<{ status: boolean; tx?: any; error?: string }>
    CreateDeviceNFT: (
        ownershipAddress: string,
        deviceId: string,
        deviceIdType: string,
        deviceType: string,
        manufacturer: string,
        deviceModel: string
    ) => Promise<{ status: boolean; tx?: any; error?: string }>
}

export function createContractStore(walletProvider: any) {
    let provider
    if (walletProvider) {
        provider = new BrowserProvider(walletProvider)
    } else {
        provider = new JsonRpcProvider(import.meta.env.VITE_RPC_URL)
    }

    return create<ContractStore>((set, get) => ({
        loading: false,
        zkpContract: new Contract(
            ContractData.storeZkpContractAddress,
            ContractData.zkpStorageABI,
            provider
        ),
        commitmentContract: new Contract(
            ContractData.commitmentContractAddress,
            ContractData.commitmentManagementABI,
            provider
        ),

        identityOwnershipRegisterationContract: new Contract(
            ContractData.identityOwnershipRegisterationContractAddress,
            ContractData.identityOwnershipRegisterationABI,
            provider
        ),

        deviceNFTManagemantContract: new Contract(
            ContractData.deviceNFTManagemantContractAddress,
            ContractData.DeviceNFTManagemantABI,
            provider
        ),

        getErrorMessage: (error: any) => {
            let errorMessage = 'An unknown error occurred'
            if (error?.reason) {
                errorMessage = error.reason
            } else if (error?.message) {
                errorMessage = error.message
            }

            return errorMessage
        },

        CreateDeviceNFT: async (
            ownershipAddress: string,
            deviceId: string,
            deviceIdType: string,
            deviceType: string,
            manufacturer: string,
            deviceModel: string
        ) => {
            const { deviceNFTManagemantContract, getErrorMessage } = get()
            try {
                set({ loading: true })
                const signer = await provider.getSigner()

                const tx = await (
                    deviceNFTManagemantContract.connect(signer) as any
                ).createNFT(
                    ownershipAddress,
                    deviceId,
                    deviceIdType,
                    deviceType,
                    manufacturer,
                    deviceModel
                )
                set({ loading: false })
                return { status: true, tx: tx }
            } catch (error) {
                set({ loading: false })
                return { status: false, error: getErrorMessage(error) }
            }
        },

        RegisterIdentity: async (
            nodeId: string
        ): Promise<{ status: boolean; tx?: any; error?: string }> => {
            const { identityOwnershipRegisterationContract, getErrorMessage } =
                get()
            try {
                set({ loading: true })
                const signer = await provider.getSigner()
                console.log('Signer wallet address:', await signer.getAddress())
                const tx = await (
                    identityOwnershipRegisterationContract.connect(
                        signer
                    ) as any
                ).registerIdentity(nodeId)
                return { status: true, tx: tx }
            } catch (error) {
                set({ loading: false })
                return { status: false, error: getErrorMessage(error) }
            }
        },

        RegisterOwnership: async (
            identityAddress: string
        ): Promise<{ status: boolean; tx?: any; error?: string }> => {
            const { identityOwnershipRegisterationContract, getErrorMessage } =
                get()
            try {
                set({ loading: true })
                const signer = await provider.getSigner()
                console.log('Signer wallet address:', await signer.getAddress())
                const tx = await (
                    identityOwnershipRegisterationContract.connect(
                        signer
                    ) as any
                ).registerOwnership(identityAddress)
                return { status: true, tx: tx }
            } catch (error) {
                set({ loading: false })
                return { status: false, error: getErrorMessage(error) }
            }
        },

        bindIdentityOwnership: async (
            ownershipAddress: string
        ): Promise<{ status: boolean; tx?: any; error?: string }> => {
            const { identityOwnershipRegisterationContract, getErrorMessage } =
                get()
            try {
                set({ loading: true })
                const signer = await provider.getSigner()
                console.log('Signer wallet address:', await signer.getAddress())
                console.log(
                    'ownershipAddress wallet address:',
                    ownershipAddress
                )
                const tx = await (
                    identityOwnershipRegisterationContract.connect(
                        signer
                    ) as any
                ).bindIdentityOwnership(ownershipAddress)
                return { status: true, tx: tx }
            } catch (error) {
                set({ loading: false })
                return { status: false, error: getErrorMessage(error) }
            }
        },

        storeZKP: async (
            nodeId,
            deviceId,
            deviceType,
            hardwareVersion,
            firmwareVersion,
            data_payload,
            zkp_payload
        ) => {
            const { zkpContract } = get()
            try {
                set({ loading: true })
                const signer = await provider.getSigner()
                const unixTimestamp = Math.floor(Date.now() / 1000)

                const tx = await (zkpContract.connect(signer) as any).storeZKP(
                    nodeId,
                    deviceId,
                    deviceType,
                    hardwareVersion,
                    firmwareVersion,
                    data_payload,
                    String(unixTimestamp),
                    zkp_payload
                )

                return tx
            } catch (error) {
                set({ loading: false })
                return false
            }
        },

        storeCommitment: async (
            commitmentID,
            nodeId,
            manufacturerName,
            deviceName,
            hardwareVersion,
            firmwareVersion,
            commitmentData
        ) => {
            const { commitmentContract } = get()
            try {
                set({ loading: true })
                const signer = await provider.getSigner()

                const tx = await (
                    commitmentContract.connect(signer) as any
                ).storeCommitment(
                    commitmentID,
                    nodeId,
                    manufacturerName,
                    deviceName,
                    hardwareVersion,
                    firmwareVersion,
                    commitmentData
                )

                return tx
            } catch (error: any) {
                set({ loading: false })
                let errorMessage = 'An unknown error occurred'
                if (error?.reason) {
                    errorMessage = error.reason
                } else if (error?.message) {
                    errorMessage = error.message
                }
                return errorMessage
            }
        },
    }))
}
