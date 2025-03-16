import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import {
    apiGetMyProfile,
    apiGetNodeTheme,
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
import { useAppKitAccount, useDisconnect } from '@reown/appkit/react'
import { useConnectWallet } from '@/hooks/useConnectWallet'
import { FaIdCard } from 'react-icons/fa'
import { FaWallet } from 'react-icons/fa'
import { useContractStore } from '@/provider/contract-provider'

const WalletSettings = () => {
    const [loading, setLoading] = useState(true)
    const [walletBalance, setWalletBalance] = useState<string | number>()
    const [userProfile, setUserProfile] = useState<any>({})
    const [nodeId, setNodeId] = useState<string>('')
    const [requestIdentityLoading, setRequestIdentityLoading] = useState(false)
    const [requestOwnershipLoading, setRequestOwnershipLoading] =
        useState(false)
    const [faucetData, setFaucetData] = useState<any>({
        address: '',
        balance: 0,
    })
    const { address, isConnected } = useAppKitAccount()
    const { disconnect } = useDisconnect()
    const {
        connectWallet,
        walletType,
        getBalance: getWalletBalance,
    } = useConnectWallet()
    const themeColor = useAppSelector((state) => state.theme.themeBackground)

    const contractStore = useContractStore()
    const { RegisterIdentity } = contractStore((state) => state)

    async function getBalance() {
        const balance = await getWalletBalance()
        setWalletBalance(balance || 0)
    }

    async function fetchData() {
        const userProfile = (await apiGetMyProfile()) as any
        const theProfile = userProfile.data.data
        const res = (await apiGetNodeTheme()) as any
        setNodeId(res?.data?.data.nodeId)
        setUserProfile(theProfile)
        getBalance()
    }
    useEffect(() => {
        fetchData()
        if (isConnected == false) return
        if (loading == true) return

        setTimeout(() => {
            handleSaveWalletAddress()
        }, 2000)
    }, [isConnected])

    useEffect(() => {
        async function fetchData() {
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
        if (isConnected == false) return
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
                    console.log('Maghol:', address)
                    console.log('Maghol 2:', nodeId)
                    const res = await RegisterIdentity(nodeId)
                    if (res.status == true) {
                        await apiSetMyIdentityWallet(String(address))
                        toast.push(
                            <Notification
                                title={'Identity wallet set successfully'}
                                type="success"
                            />,
                            {
                                placement: 'top-center',
                            }
                        )
                    } else {
                        toast.push(
                            <Notification title={res.error} type="danger" />,
                            {
                                placement: 'top-center',
                            }
                        )
                    }
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
        await fetchData()
        setRequestIdentityLoading(false)
        setRequestOwnershipLoading(false)
    }

    return (
        <>
            {(loading == false && (
                <main>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap justify-around gap-6">
                            <section
                                className={`flex flex-col gap-4 bg-${themeColor} rounded-lg p-4 shadow-[0_0_7px_2px_rgba(31,41,55,0.9)] max-w-[500px]`}
                            >
                                <div className="flex items-center gap-3">
                                    <FaIdCard className="text-xl" />
                                    <h5>Identity Wallet</h5>
                                </div>

                                {(userProfile.identityWallet && (
                                    <>
                                        <p className="break-all">
                                            Address:{' '}
                                            <span className="text-white">
                                                {userProfile.identityWallet}
                                            </span>
                                        </p>
                                        {isConnected &&
                                            walletType == 'identity' && (
                                                <p className="break-all">
                                                    Balance:{' '}
                                                    <span className="text-white">
                                                        {walletBalance}
                                                    </span>
                                                </p>
                                            )}
                                    </>
                                )) || (
                                    <p className="text-white">
                                        You have not registered your identity
                                        wallet.
                                    </p>
                                )}

                                <div className="flex w-full gap-2 mt-auto">
                                    {(isConnected &&
                                        walletType == 'identity' && (
                                            <>
                                                <Button
                                                    className="w-full"
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
                                            className="w-full"
                                            variant="solid"
                                            size="sm"
                                            disabled={
                                                isConnected &&
                                                walletType == 'ownership'
                                            }
                                            onClick={() =>
                                                connectWallet('identity')
                                            }
                                        >
                                            {userProfile.identityWallet
                                                ? 'Connect'
                                                : 'Register'}
                                        </Button>
                                    )}
                                    <Button
                                        className="w-full"
                                        loading={requestIdentityLoading}
                                        onClick={() =>
                                            handleRequestFaucet('identity')
                                        }
                                        variant="solid"
                                        size="xs"
                                    >
                                        Receive Test Token
                                    </Button>
                                </div>
                            </section>

                            <section
                                className={`flex flex-col gap-4 bg-${themeColor} rounded-lg p-4 shadow-[0_0_7px_2px_rgba(31,41,55,0.9)] max-w-[500px]`}
                            >
                                <div className="flex items-center gap-3">
                                    <FaWallet className="text-xl" />
                                    <h5>Ownership Wallet</h5>
                                </div>

                                {(userProfile.ownerShipWallets &&
                                    userProfile.ownerShipWallets.length > 0 && (
                                        <>
                                            <p className="break-all">
                                                Address:{' '}
                                                <span className="text-white">
                                                    {
                                                        userProfile
                                                            .ownerShipWallets[0]
                                                    }
                                                </span>
                                            </p>
                                            {isConnected &&
                                                walletType == 'ownership' && (
                                                    <p className="break-all">
                                                        Balance:{' '}
                                                        <span className="text-white">
                                                            {walletBalance}
                                                        </span>
                                                    </p>
                                                )}
                                        </>
                                    )) || (
                                    <p className="text-white">
                                        You have not registered your ownership
                                        wallet.
                                    </p>
                                )}

                                <div className="flex w-full gap-2 mt-auto">
                                    {(isConnected &&
                                        walletType == 'ownership' && (
                                            <>
                                                <Button
                                                    className="w-full"
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
                                            className="w-full"
                                            variant="solid"
                                            size="sm"
                                            disabled={
                                                isConnected &&
                                                walletType == 'identity'
                                            }
                                            onClick={() =>
                                                connectWallet('ownership')
                                            }
                                        >
                                            {userProfile.ownerShipWallets &&
                                            userProfile.ownerShipWallets
                                                .length > 0
                                                ? 'Connect'
                                                : 'Register'}
                                        </Button>
                                    )}
                                    <Button
                                        className="w-full"
                                        loading={requestOwnershipLoading}
                                        onClick={() =>
                                            handleRequestFaucet('ownership')
                                        }
                                        variant="solid"
                                        size="xs"
                                    >
                                        Receive Test Token
                                    </Button>
                                </div>
                            </section>
                        </div>

                        <Button
                            size="sm"
                            variant="solid"
                            className="w-fit mx-auto mt-1"
                        >
                            Bind Identity and Ownership Wallets
                        </Button>

                        <span className="w-full border-t border-gray-600 my-4"></span>

                        <div className="flex items-center gap-4">
                            <p className="font-bold">
                                {'Network faucet address: '}
                                <span className="text-white font-normal break-all">
                                    {faucetData.address}
                                </span>
                            </p>
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

export default WalletSettings
