import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { apiEditUserProfile, apiGetCurUserProfile } from '@/services/UserApi' // Assuming you have an API function to save the address
import { useEffect, useState } from 'react'
import { Loading } from '@/components/shared'
import { Input } from '@/components/ui'
import { HiCurrencyDollar } from 'react-icons/hi'
import FormDesription from './FormDesription'
import { useAppSelector } from '@/store'
import {
    apiGetFaucetWalletData,
    apiRequestFaucet,
} from '@/services/ContractServices'
import { useQueryClient } from '@tanstack/react-query'
import { useWalletBalance } from '@/utils/hooks/useWaletAddress'

const Verify = () => {
    const [loading, setLoading] = useState(true)
    const [requestLoading, setRequestLoading] = useState(false)
    const [walletAddress, setWalletAddress] = useState('')
    const [faucetData, setFaucetData] = useState<any>({
        address: '',
        balance: 0,
    })
    const { _id: userId } = useAppSelector((state) => state.auth.user)
    const {
        data: walletData,
        isError: walletError,
        isLoading: walletLoading,
    } = useWalletBalance()

    const queryClient = useQueryClient()

    useEffect(() => {
        async function fetchData() {
            const resfaucetAddress = (await apiGetFaucetWalletData()) as any
            setFaucetData(resfaucetAddress.data.data)
            const resData = (await apiGetCurUserProfile()) as any
            setWalletAddress(resData.data.data.walletAddress || '') // Initialize from API data if available
            setLoading(false)
        }
        fetchData()
    }, [])

    const isValidWalletAddress = (address: string) => {
        const regex = /^0x[a-fA-F0-9]{40}$/
        return regex.test(address)
    }

    async function handleRequestFaucet() {
        try {
            setRequestLoading(true)
            const response = await apiRequestFaucet()
            setRequestLoading(false)
            setTimeout(() => {
                queryClient.invalidateQueries(['walletBalance'])
            }, 1000)
            toast.push(
                <Notification
                    title="Tokens from the faucet have been successfully deposited into
                    your wallet!"
                    type="success"
                />,
                {
                    placement: 'top-center',
                }
            )
        } catch (error: any) {
            setRequestLoading(false)
            toast.push(
                <Notification
                    title={error.response.data.message}
                    type="danger"
                />,
                {
                    placement: 'top-center',
                }
            )
        }
    }

    const handleSaveWalletAddress = async () => {
        if (isValidWalletAddress(walletAddress)) {
            try {
                setRequestLoading(true)
                await apiEditUserProfile(userId || '', {
                    walletAddress: walletAddress,
                })
                setTimeout(() => {
                    queryClient.invalidateQueries(['walletBalance'])
                }, 1000)
                toast.push(
                    <Notification title="Success" type="success">
                        Wallet address saved successfully!
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            } catch (error) {
                console.error('Error saving wallet address:', error)
                toast.push(
                    <Notification title="Error" type="danger">
                        Failed to save wallet address. Please try again.
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            }
            setRequestLoading(false)
        } else {
            toast.push(
                <Notification title="Error" type="danger">
                    Invalid wallet address format.
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        }
    }

    return (
        <>
            {(loading == false && walletLoading == false && (
                <main>
                    <div className="flex text-[1rem] flex-col gap-4">
                        <p>
                            Note: Create a wallet on the FidesInnova blockchain.
                            For instructions on how to create a new wallet,{' '}
                            <a
                                href="https://fidesinnova-1.gitbook.io/fidesinnova-docs/using-the-network/adding-the-network-to-metamask"
                                target="_blank"
                                className="underline cursor-pointer"
                            >
                                click here
                            </a>
                            .
                        </p>
                        <div className="flex items-center justify-between gap-4">
                            <p className=" font-bold no-wrap">
                                Enter your wallet address:
                            </p>
                            <Input
                                value={walletAddress}
                                onChange={(e) =>
                                    setWalletAddress(e.target.value)
                                }
                                type="text"
                                autoComplete="off"
                                name="walletAddress"
                                placeholder="wallet address"
                            />
                            <Button
                                loading={requestLoading}
                                variant="solid"
                                onClick={handleSaveWalletAddress}
                            >
                                Save
                            </Button>
                        </div>

                        <div className="flex items-center gap-8">
                            <p className="font-bold">
                                {(walletData?.data == null &&
                                    'Wallet address not found!') ||
                                    `Your wallet balance: `}
                                {walletData?.data != null && (
                                    <span className="text-white font-normal">
                                        {walletData?.data} FDS
                                    </span>
                                )}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <p className="font-bold">
                                {'Network faucet address: '}
                                <span className="text-white font-normal">
                                    {faucetData.address}
                                </span>
                            </p>
                        </div>
                        <div className="flex items-center">
                            <p>
                                Note: You can receive 5 tokens daily. To obtain
                                more tokens, contact your node administrator.
                            </p>
                        </div>
                        <div className="flex items-center">
                            <Button
                                loading={requestLoading}
                                onClick={handleRequestFaucet}
                                variant="solid"
                                color="green"
                                size="md"
                            >
                                Request Tokens From the Faucet
                            </Button>
                        </div>
                    </div>
                </main>
            )) || (
                <div className="w-full h-[60dvh]">
                    <Loading loading={true} />
                </div>
            )}
        </>
    )
}

export default Verify
