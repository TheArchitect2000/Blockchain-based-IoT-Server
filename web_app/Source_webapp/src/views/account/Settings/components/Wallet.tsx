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
    useAppKit,
} from '@reown/appkit/react'
import { BrowserProvider, formatUnits } from 'ethers'

const WalletSettings = () => {
    const [loading, setLoading] = useState(true)
    const [requestLoading, setRequestLoading] = useState(false)
    const [walletBalance, setWalletBalance] = useState<null | string>(null)
    const [faucetData, setFaucetData] = useState<any>({
        address: '',
        balance: 0,
    })
    const { _id: userId } = useAppSelector((state) => state.auth.user)
    const { address, isConnected } = useAppKitAccount()
    const { open } = useAppKit()
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
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center flex-col md:flex-row">
                            <p className="font-bold no-wrap mr-2">
                                {!isConnected ? 'Connect your' : 'Your'}{' '}
                                identity wallet:
                            </p>
                            {(isConnected && (
                                <>
                                    <p className="text-white ml-1 mr-4">
                                        {address}
                                    </p>
                                    <Button
                                        variant="solid"
                                        color="red"
                                        size="sm"
                                        onClick={disconnect}
                                    >
                                        Disconnect
                                    </Button>
                                </>
                            )) || (
                                <Button
                                    variant="solid"
                                    size="sm"
                                    onClick={() => open()}
                                >
                                    Connect
                                </Button>
                            )}
                        </div>

                        <div className="flex items-center flex-col md:flex-row">
                            <p className="font-bold no-wrap mr-2">
                                Connect your ownership wallet:
                            </p>
                            <Button variant="solid" size="sm">
                                Connect
                            </Button>
                        </div>

                        <Button size="sm" variant="solid" className="w-fit">
                            Link Your Ownership Wallet to Your Identity Wallet
                        </Button>

                        <span className="w-full border-t border-gray-600 my-4"></span>

                        <Button size="sm" variant="solid" className="w-fit">
                            Create IoT Device NFT
                        </Button>

                        <Button
                            className="w-fit"
                            loading={requestLoading}
                            onClick={handleRequestFaucet}
                            variant="solid"
                            size="sm"
                        >
                            Receive Test FDS Token
                        </Button>

                        <Button size="sm" variant="solid" className="w-fit">
                            Show Your Asset (IoT Device NFT, Token) in Your
                            Ownership Wallet
                        </Button>

                        <span className="w-full border-t border-gray-600 my-4"></span>

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
                        {/* <div className="flex items-center">
                            <p>
                                Note: You can receive 5 tokens daily. To obtain
                                more tokens, contact your node administrator.
                            </p>
                        </div> */}

                        <span className="w-full border-t border-gray-600 my-4"></span>
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

export default WalletSettings
