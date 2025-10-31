import { Loading } from '@/components/shared'
import { Button, Dropdown, Input, Notification, toast } from '@/components/ui'
import { useAppSelector } from '@/store'
import { SyntheticEvent, useEffect, useState } from 'react'
import { FaCoins, FaMobile, FaWallet } from 'react-icons/fa'
import { GiWallet } from 'react-icons/gi'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import { useAppKitProvider } from '@reown/appkit/react'
import { BrowserProvider, ethers, isAddress, parseEther } from 'ethers'
import { FiPackage } from 'react-icons/fi'
import { Avatar, Dialog } from '@/components/ui'
import { apiGetDevices } from '@/services/DeviceApi'

export default function FDSToken() {
    const [loading, setLoading] = useState<boolean>(true)
    const [wallets, setWallets] = useState<Array<string>>([])
    const [destinationWallet, setDestinationWallet] = useState<string>('')
    const [isValidDestination, setIsValidDestination] = useState<boolean>(true)
    const [amount, setAmount] = useState<string>('')
    const [transactionId, setTransactionId] = useState<string | null>(null)
    const [isPending, setIsPending] = useState<boolean>(false)
    const themeColor = useAppSelector((state) => state.theme.themeBackground)
    const { walletProvider } = useAppKitProvider('eip155')
    const [selectedWallet, setSelectedWallet] = useState<string>(
        walletProvider ? 'Select Wallet' : 'No Wallet Connected'
    )
    const [devices, setDevices] = useState<any[]>([])
    const [isLoadingDevices, setIsLoadingDevices] = useState(true)
    const [selectedDevice, setSelectedDevice] = useState<any>(null)
    const [showDeviceDialog, setShowDeviceDialog] = useState(false)

    const { _id: userId } = useAppSelector((state) => state.auth.user)

    async function fetchData() {
        setLoading(true)
        const wallets = await getConnectedWallets()
        setWallets(wallets)
        setLoading(false)
    }

    async function getConnectedWallets(): Promise<Array<string>> {
        if (!walletProvider) {
            return []
        }
        const ethersProvider = new BrowserProvider(walletProvider as any)
        const accounts = await ethersProvider.send('eth_requestAccounts', [])
        return accounts || []
    }

    async function fetchDevices() {
        try {
            setIsLoadingDevices(true)
            const deviceRes = (await apiGetDevices(userId || '')) as any
            setDevices(deviceRes.data.data)
        } catch (error) {
            console.error('Error fetching devices:', error)
            toast.push(
                <Notification title={'Failed to load devices'} type="danger" />,
                { placement: 'top-center' }
            )
        } finally {
            setIsLoadingDevices(false)
        }
    }

    useEffect(() => {
        fetchData()
        fetchDevices()
    }, [])

    const handleSelect = (eventKey: string, event: SyntheticEvent) => {
        setSelectedWallet(eventKey)
    }

    const handleDestinationChange = (value: string) => {
        setDestinationWallet(value)
        setIsValidDestination(isAddress(value))
    }

    const handleAmountChange = (value: string) => {
        setAmount(value)
    }

    const handleTransfer = async () => {
        if (!isAddress(destinationWallet)) {
            setIsValidDestination(false)
            return
        }

        if (!walletProvider || selectedWallet === 'No Wallet Connected') {
            return toast.push(
                <Notification
                    title={'Please connect a wallet first.'}
                    type="danger"
                />,
                {
                    placement: 'top-center',
                }
            )
        }

        if (selectedWallet === destinationWallet) {
            return toast.push(
                <Notification
                    title={'Source and destination wallets must be different.'}
                    type="danger"
                />,
                {
                    placement: 'top-center',
                }
            )
        }

        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            return toast.push(
                <Notification
                    title={'Please enter a valid amount.'}
                    type="danger"
                />,
                {
                    placement: 'top-center',
                }
            )
        }

        try {
            setIsPending(true)
            const ethersProvider = new BrowserProvider(walletProvider as any)
            const signer = await ethersProvider.getSigner()
            const tx = await signer.sendTransaction({
                to: destinationWallet,
                value: parseEther(amount),
            })

            await tx.wait()
            setTransactionId(tx.hash)
            toast.push(
                <Notification title={'Transfer successful!'} type="success" />,
                {
                    placement: 'top-center',
                }
            )
        } catch (error) {
            console.error('Transfer failed:', error)
            toast.push(
                <Notification
                    title={'Transfer failed. Please try again.'}
                    type="danger"
                />,
                {
                    placement: 'top-center',
                }
            )
        } finally {
            setIsPending(false)
        }
    }

    const DeviceSelectionDialog = () => (
        <Dialog
            contentClassName="max-w-[400px]"
            isOpen={showDeviceDialog}
            onClose={() => setShowDeviceDialog(false)}
            onRequestClose={() => setShowDeviceDialog(false)}
        >
            <h5 className="mb-4">Select Device</h5>
            {isLoadingDevices ? (
                <div className="flex items-center justify-center h-[200px]">
                    <Loading loading={true} />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto">
                    {devices.map((device) => (
                        <div
                            key={device.deviceEncryptedId}
                            onClick={() => {
                                setSelectedDevice(device)
                                setShowDeviceDialog(false)
                            }}
                            className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-700"
                        >
                            <Avatar
                                imgClass="!object-contain p-1"
                                className={`!w-[70px] !h-[70px] overflow-hidden border-2 shadow-lg`}
                                style={{
                                    borderColor: '#1f2937',
                                }}
                                size={60}
                                shape="circle"
                                src={device.image}
                                icon={!device.image && <FiPackage />}
                            />
                            <div>
                                <p className="font-medium">
                                    {device.deviceName}
                                </p>
                                <p className="text-sm text-gray-400">
                                    {device.deviceType}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Dialog>
    )

    return (
        <>
            {(loading == false && (
                <section className="flex flex-wrap justify-around">
                    <div
                        className={`flex flex-col gap-4 bg-${themeColor} rounded-lg p-4 shadow-[0_0_7px_2px_rgba(31,41,55,0.9)] max-w-[500px]`}
                    >
                        <h5>Transfer Token</h5>

                        <div className="flex items-center gap-3">
                            <p className="text-white">From:</p>
                            <Dropdown
                                activeKey={selectedWallet}
                                toggleClassName="!border border-gray-500 rounded-lg"
                                renderTitle={
                                    <p className="flex items-center p-3 gap-2 cursor-pointer">
                                        <FaWallet /> {selectedWallet}{' '}
                                        <MdOutlineKeyboardArrowDown />
                                    </p>
                                }
                                onSelect={(eventKey, event) =>
                                    handleSelect(eventKey, event)
                                }
                                disabled={isPending}
                            >
                                {wallets.length > 0 &&
                                    wallets.map((address) => (
                                        <Dropdown.Item
                                            eventKey={address}
                                            key={address}
                                        >
                                            {address}
                                        </Dropdown.Item>
                                    ))}
                            </Dropdown>
                        </div>

                        <div className="flex items-center gap-3">
                            <p className="text-white">To:</p>
                            <Input
                                type="text"
                                placeholder="Destination Wallet"
                                prefix={<GiWallet className="text-[1rem]" />}
                                value={destinationWallet}
                                onChange={(e) =>
                                    handleDestinationChange(e.target.value)
                                }
                                disabled={isPending}
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <p className="text-white">Amount:</p>
                            <Input
                                type="number"
                                placeholder="Amount"
                                prefix={<FaCoins className="text-[1rem]" />}
                                value={amount}
                                onChange={(e) =>
                                    handleAmountChange(e.target.value)
                                }
                                disabled={isPending}
                            />
                        </div>

                        {transactionId && (
                            <p className="text-white break-all text-justify">
                                Transaction ID:{' '}
                                <span
                                    className="text-green-500 hover:underline cursor-pointer"
                                    onClick={() =>
                                        window.open(
                                            `https://explorer.fidesinnova.io/tx/${transactionId}`,
                                            '_blank'
                                        )
                                    }
                                >
                                    {transactionId}
                                </span>
                            </p>
                        )}

                        <Button
                            variant="solid"
                            size="sm"
                            onClick={handleTransfer}
                            loading={isPending}
                        >
                            {isPending ? 'Processing...' : 'Transfer'}
                        </Button>
                    </div>
                    <div
                        className={`flex flex-col gap-4 bg-${themeColor} rounded-lg p-4 shadow-[0_0_7px_2px_rgba(31,41,55,0.9)] max-w-[500px]`}
                    >
                        <h5>Transfer Device NFT</h5>

                        <div className="flex items-center gap-3">
                            <p className="text-white">From:</p>
                            <Dropdown
                                activeKey={selectedWallet}
                                toggleClassName="!border border-gray-500 rounded-lg"
                                renderTitle={
                                    <p className="flex items-center p-3 gap-2 cursor-pointer">
                                        <FaWallet /> {selectedWallet}{' '}
                                        <MdOutlineKeyboardArrowDown />
                                    </p>
                                }
                                onSelect={(eventKey, event) =>
                                    handleSelect(eventKey, event)
                                }
                            >
                                {wallets.length > 0 &&
                                    wallets.map((address) => (
                                        <Dropdown.Item
                                            eventKey={address}
                                            key={address}
                                        >
                                            {address}
                                        </Dropdown.Item>
                                    ))}
                            </Dropdown>
                        </div>

                        <div className="flex items-center gap-3">
                            <p className="text-white">To:</p>
                            <Input
                                type="text"
                                placeholder="Destination OwnerShip Wallet"
                                prefix={<GiWallet className="text-[1rem]" />}
                                value={destinationWallet}
                                onChange={(e) =>
                                    handleDestinationChange(e.target.value)
                                }
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <p className="text-white">Device NFT:</p>
                            <div className="flex-1">
                                <Input
                                    type="text"
                                    placeholder="Select Device NFT"
                                    prefix={
                                        <FaMobile className="text-[1rem]" />
                                    }
                                    value={
                                        selectedDevice
                                            ? selectedDevice.deviceName
                                            : ''
                                    }
                                    readOnly
                                    suffix={
                                        <Button
                                            size="xs"
                                            variant="twoTone"
                                            onClick={() =>
                                                setShowDeviceDialog(true)
                                            }
                                            disabled={isPending}
                                        >
                                            Select
                                        </Button>
                                    }
                                />
                            </div>
                        </div>

                        <Button
                            variant="solid"
                            size="sm"
                            onClick={handleTransfer}
                            className="mt-auto"
                        >
                            {isPending ? 'Processing...' : 'Transfer'}
                        </Button>
                    </div>
                </section>
            )) || (
                <section className="flex items-center justify-center h-[30vh] w-full">
                    <Loading loading={true} />
                </section>
            )}
            <DeviceSelectionDialog />
        </>
    )
}
