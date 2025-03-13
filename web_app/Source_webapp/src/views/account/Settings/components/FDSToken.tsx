import { Loading } from '@/components/shared'
import { Button, Dropdown, Input, Notification, toast } from '@/components/ui'
import { useAppSelector } from '@/store'
import { SyntheticEvent, useEffect, useState } from 'react'
import { FaCoins, FaWallet } from 'react-icons/fa'
import { GiWallet } from 'react-icons/gi'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import { useAppKitProvider } from '@reown/appkit/react'
import { BrowserProvider, ethers, isAddress, parseEther } from 'ethers'
import { HiCurrencyDollar } from 'react-icons/hi'

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
        console.log('Selected accounts:', accounts)
        return accounts || []
    }

    useEffect(() => {
        fetchData()
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

    return (
        <>
            {(loading == false && (
                <section className="flex flex-col gap-4">
                    <h4>FDS Token</h4>

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
                                type="text"
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
                </section>
            )) || (
                <section className="flex items-center justify-center h-[30vh] w-full">
                    <Loading loading={true} />
                </section>
            )}
        </>
    )
}
