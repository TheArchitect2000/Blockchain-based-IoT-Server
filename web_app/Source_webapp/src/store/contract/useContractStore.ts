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
    getErrorMessage: (error: any) => string
    RegisterIdentity: (nodeId: string) => Promise<{status: boolean, tx?: any, error?: string}>
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
}

export function createContractStore(walletProvider: any) {
    let provider
    if (walletProvider) {
        provider = new BrowserProvider(walletProvider)
    } else {
        provider = new JsonRpcProvider('https://fidesf1-rpc.fidesinnova.io')
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

        getErrorMessage: (error: any) => {
            let errorMessage = 'An unknown error occurred'
            if (error?.reason) {
                errorMessage = error.reason
            } else if (error?.message) {
                errorMessage = error.message
            }

            return errorMessage
        },

        RegisterIdentity: async (nodeId: string): Promise<{status: boolean, tx?: any, error?: string}> => {
            const { identityOwnershipRegisterationContract, getErrorMessage } =
                get()
            try {
                set({ loading: true })
                const signer = await provider.getSigner()
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
