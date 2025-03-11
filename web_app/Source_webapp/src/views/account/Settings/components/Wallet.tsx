import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import {
    apiEditUserProfile,
    apiGetMyProfile,
    apiSetMyIdentityWallet,
    apiSetMyOwnerShipWallet,
} from '@/services/UserApi' // Assuming you have an API function to save the address
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
import { useWalletStore } from '@/store/user/useWalletStore'
import { useConnectWallet } from '@/hooks/useConnectWallet'

const WalletSettings = () => {
    const [loading, setLoading] = useState(true)
    const [userProfile, setUserProfile] = useState<any>({})
    const [requestIdentityLoading, setRequestIdentityLoading] = useState(false)
    const [requestOwnershipLoading, setRequestOwnershipLoading] =
        useState(false)
    const [walletBalance, setWalletBalance] = useState<null | string>(null)
    const [faucetData, setFaucetData] = useState<any>({
        address: '',
        balance: 0,
    })
    const { _id: userId } = useAppSelector((state) => state.auth.user)
    const { address, isConnected } = useAppKitAccount()
    const { walletProvider } = useAppKitProvider('eip155')
    const { disconnect } = useDisconnect()

    const { connectWallet, walletType } = useConnectWallet()

    async function getBalance() {
        if (!isConnected) return
        const ethersProvider = new BrowserProvider(walletProvider as any)
        const balanceWei = await ethersProvider.getBalance(String(address))
        setWalletBalance(formatUnits(balanceWei, 18).slice(0, 7))
    }

    async function fetchData() {
        const userProfile = (await apiGetMyProfile()) as any
        const theProfile = userProfile.data.data
        setUserProfile(theProfile)
    }
    useEffect(() => {
        fetchData()
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

    async function handleRequestFaucet(type: 'identity' | 'ownership') {
        try {
            if (type == 'identity') {
                setRequestIdentityLoading(true)
            } else {
                setRequestOwnershipLoading(true)
            }

            const userProfile = (await apiGetMyProfile()) as any
            const theProfile = userProfile.data.data

            try {
                await apiRequestFaucet(
                    type,
                    type == 'ownership'
                        ? theProfile.ownerShipWallets[0]
                        : theProfile.identityWallet
                )
                setTimeout(() => {
                    getBalance()
                }, 1000)
                toast.push(
                    <Notification
                        title={`Tokens from the faucet have been successfully deposited into
                        your ${type} wallet!`}
                        type="success"
                    />,
                    {
                        placement: 'top-center',
                    }
                )
            } catch (error: any) {
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

            setRequestIdentityLoading(false)
            setRequestOwnershipLoading(false)
        } catch (error: any) {
            setRequestIdentityLoading(false)
            setRequestOwnershipLoading(false)
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
        const userProfile = (await apiGetMyProfile()) as any
        const theProfile = userProfile.data.data

        try {
            if (walletType == 'identity') {
                if (
                    theProfile.identityWallet &&
                    theProfile.identityWallet.length > 0
                ) {
                    if (String(theProfile.identityWallet) !== String(address)) {
                        disconnect()
                        toast.push(
                            <Notification
                                title={
                                    'Your identity wallet is: ' +
                                    theProfile.identityWallet
                                }
                                type="danger"
                                width={'max-content'}
                                duration={7500}
                            />,
                            {
                                placement: 'top-center',
                            }
                        )
                    }
                    return
                }
                setRequestIdentityLoading(true)

                try {
                    await apiSetMyIdentityWallet(String(address))
                    toast.push(
                        <Notification
                            title={'Ownership wallet set successfully'}
                            type="success"
                        />,
                        {
                            placement: 'top-center',
                        }
                    )
                } catch (error: any) {
                    setRequestIdentityLoading(false)
                    disconnect()
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
            } else {
                if (
                    theProfile.ownerShipWallets &&
                    theProfile.ownerShipWallets.length > 0
                ) {
                    if (
                        String(theProfile.ownerShipWallets[0]) !==
                        String(address)
                    ) {
                        disconnect()
                        toast.push(
                            <Notification
                                title={
                                    'Your ownership wallet is: ' +
                                    theProfile.ownerShipWallets[0]
                                }
                                type="danger"
                                width={'max-content'}
                                duration={7500}
                            />,
                            {
                                placement: 'top-center',
                            }
                        )
                    }
                    return
                }

                setRequestOwnershipLoading(true)
                try {
                    await apiSetMyOwnerShipWallet(String(address))
                    toast.push(
                        <Notification
                            title={'Ownership wallet set successfully'}
                            type="success"
                        />,
                        {
                            placement: 'top-center',
                        }
                    )
                } catch (error: any) {
                    setRequestOwnershipLoading(false)
                    disconnect()
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
        setRequestIdentityLoading(false)
        setRequestOwnershipLoading(false)
    }

    return (
        <>
            {(loading == false && (
                <main>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center flex-col md:flex-row">
                            <p className="font-bold no-wrap mr-2">
                                {isConnected && walletType == 'identity'
                                    ? 'Your'
                                    : 'Connect your'}{' '}
                                identity wallet{' '}
                                {userProfile.identityWallet && (
                                    <small className="text-gray-300">
                                        ({userProfile.identityWallet})
                                    </small>
                                )}
                                :
                            </p>
                            {(isConnected && walletType == 'identity' && (
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
                                    disabled={
                                        isConnected && walletType == 'ownership'
                                    }
                                    onClick={() => connectWallet('identity')}
                                >
                                    Connect
                                </Button>
                            )}
                        </div>
                        <Button
                            className="w-fit"
                            loading={requestIdentityLoading}
                            onClick={() => handleRequestFaucet('identity')}
                            variant="solid"
                            size="sm"
                        >
                            Receive Test FDS Token in Identity Wallet
                        </Button>

                        <div className="flex items-center flex-col md:flex-row">
                            <p className="font-bold no-wrap mr-2">
                                {isConnected && walletType == 'ownership'
                                    ? 'Your'
                                    : 'Connect your'}{' '}
                                ownership wallet{' '}
                                {userProfile.ownerShipWallets &&
                                    userProfile.ownerShipWallets.length > 0 && (
                                        <small className="text-gray-300">
                                            ({userProfile.ownerShipWallets[0]})
                                        </small>
                                    )}
                                :
                            </p>
                            {(isConnected && walletType == 'ownership' && (
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
                                    disabled={
                                        isConnected && walletType == 'identity'
                                    }
                                    onClick={() => connectWallet('ownership')}
                                >
                                    Connect
                                </Button>
                            )}
                        </div>

                        <Button
                            className="w-fit"
                            loading={requestOwnershipLoading}
                            onClick={() => handleRequestFaucet('ownership')}
                            variant="solid"
                            size="sm"
                        >
                            Receive Test FDS Token in OwnerShip Wallet
                        </Button>

                        <Button size="sm" variant="solid" className="w-fit">
                            Link Your Ownership Wallet to Your Identity Wallet
                        </Button>

                        <span className="w-full border-t border-gray-600 my-4"></span>

                        <Button size="sm" variant="solid" className="w-fit">
                            Create IoT Device NFT
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
