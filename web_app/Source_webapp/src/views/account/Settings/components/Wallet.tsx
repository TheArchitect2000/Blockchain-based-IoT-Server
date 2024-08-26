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
    apiGetWalletBalance,
    apiRequestFaucet,
} from '@/services/ContractServices'
import { useQuery } from '@tanstack/react-query'
import { ApiResponse } from '@/utils/hooks/useDeleteService'
import { useWalletBalance } from '@/utils/hooks/useWaletAddress'

const Verify = () => {
    const [apiData, setApiData] = useState<any>({})
    const [loading, setLoading] = useState(true)
    const [requestLoading, setRequestLoading] = useState(false)
    const [walletAddress, setWalletAddress] = useState('')
    const { _id: userId } = useAppSelector((state) => state.auth.user)
    const {
        data: walletData,
        isError: walletError,
        isLoading: walletLoading,
    } = useWalletBalance()

    useEffect(() => {
        async function fetchData() {
            const resData = (await apiGetCurUserProfile()) as any
            setApiData(resData.data.data)
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
            toast.push(
                <Notification title="Success" type="success">
                    Faucet has been successfully deposited into your wallet !
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        } catch (error: any) {
            setRequestLoading(false)
            toast.push(
                <Notification
                    title="Error while requesting faucet"
                    type="danger"
                >
                    Your wallet address is invalid or you should wait 24 hour !
                </Notification>,
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
                    <div className="flex flex-col gap-4">
                        <FormDesription
                            className="mb-4"
                            title="Your wallet datas"
                            desc="All of your wallet datas are protected"
                        />
                        <div className="flex items-center gap-8">
                            <p className="text-[1rem]">
                                Wallet value:{' '}
                                {(walletError && 'Invalid wallet address !') ||
                                    `${walletData?.data} FDS`}
                            </p>
                            <Button
                                loading={requestLoading}
                                onClick={handleRequestFaucet}
                                variant="solid"
                                color="green"
                            >
                                Request Faucet
                            </Button>
                        </div>
                        <div className="flex justify-between gap-4">
                            <Input
                                value={walletAddress}
                                onChange={(e) =>
                                    setWalletAddress(e.target.value)
                                }
                                type="text"
                                autoComplete="off"
                                name="walletAddress"
                                placeholder="wallet address"
                                prefix={
                                    <HiCurrencyDollar className="text-xl" />
                                }
                            />
                            <Button
                                loading={requestLoading}
                                variant="solid"
                                onClick={handleSaveWalletAddress}
                            >
                                Save
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
