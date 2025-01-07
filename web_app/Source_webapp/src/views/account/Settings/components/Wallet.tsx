import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { apiEditUserProfile, apiGetCurUserProfile } from '@/services/UserApi' // Assuming you have an API function to save the address
import { useEffect, useState } from 'react'
import { Loading } from '@/components/shared'
import { useAppSelector } from '@/store'
import {
    apiGetFaucetWalletData,
    apiRequestFaucet,
} from '@/services/ContractServices'
import {
    useAppKitProvider,
    useAppKitAccount,
    useDisconnect,
} from '@reown/appkit/react'
import { BrowserProvider, formatUnits } from 'ethers'


const Verify = () => {
    const [loading, setLoading] = useState(true)
    const [requestLoading, setRequestLoading] = useState(false)
    const [walletBalance, setWalletBalance] = useState<null | string>(null)
    const [faucetData, setFaucetData] = useState<any>({
        address: '',
        balance: 0,
    })
    const { _id: userId } = useAppSelector((state) => state.auth.user)
    const { address, isConnected } = useAppKitAccount()
    const { walletProvider } = useAppKitProvider('eip155')
    const { disconnect } = useDisconnect()

    async function getBalance() {
        if (!isConnected) return
        const ethersProvider = new BrowserProvider(walletProvider as any)
        const balanceWei = await ethersProvider.getBalance(String(address))
        setWalletBalance(formatUnits(balanceWei, 18).slice(0, 7))
    }

    useEffect(() => {
        if (isConnected == false) return
        if (loading == true) return
        handleSaveWalletAddress()
    }, [isConnected])

    useEffect(() => {
        async function fetchData() {
            await getBalance()
            const resfaucetAddress = (await apiGetFaucetWalletData()) as any
            setFaucetData(resfaucetAddress.data.data)
            const resData = (await apiGetCurUserProfile()) as any
            setLoading(false)
        }
        fetchData()
    }, [])

    async function handleRequestFaucet() {
        try {
            setRequestLoading(true)
            const response = await apiRequestFaucet()
            setRequestLoading(false)
            setTimeout(() => {
                getBalance()
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
        try {
            setRequestLoading(true)
            await apiEditUserProfile(userId || '', {
                walletAddress: address,
            })
            setTimeout(() => {
                getBalance()
            }, 1000)
            toast.push(
                <Notification
                    title="Wallet address saved successfully!"
                    type="success"
                />,
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
    }

    return (
        <>
            {(loading == false && (
                <main>
                    <div className="flex text-[1rem] flex-col gap-4">
                        <p>
                            Note: Create a wallet on the FidesInnova blockchain.
                            For instructions on how to create a new wallet,{' '}
                            <a
                                href="https://fidesinnova-1.gitbook.io/fidesinnova-docs/users-how-to-use-the-fidesinnova-network/connecting-your-metamask-to-the-fidesinnova-network"
                                target="_blank"
                                className="underline cursor-pointer"
                            >
                                click here
                            </a>
                            .
                        </p>

                        <div className="flex items-center flex-col md:flex-row gap-4">
                            <p className=" font-bold no-wrap">
                                {!isConnected ? 'Connect your' : 'Your'} wallet
                                address:
                            </p>
                            {(isConnected && (
                                <>
                                    <p className="text-white">{address}</p>
                                    <Button
                                        variant="solid"
                                        color="red"
                                        size="sm"
                                        onClick={disconnect}
                                    >
                                        Disconnect
                                    </Button>
                                </>
                            )) || <appkit-button balance="hide" />}
                        </div>

                        {isConnected && (
                            <div className="flex items-center gap-8">
                                <p className="font-bold">
                                    {(walletBalance == null &&
                                        'Wallet address not found!') ||
                                        `Your wallet balance: `}
                                    {walletBalance != null && (
                                        <span className="text-white font-normal">
                                            {walletBalance} FDS
                                        </span>
                                    )}
                                </p>
                            </div>
                        )}
                        <div className="flex items-center gap-4">
                            <p className="font-bold">
                                {'Network faucet address: '}
                                <span className="text-white font-normal break-all">
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
                        <div className="flex items-center w-full">
                            <Button
                                className="w-full sm:w-auto"
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
