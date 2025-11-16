import { useWalletStore, WalletType } from '@/store/user/useWalletStore'
import {
    useAppKit,
    useAppKitAccount,
    useAppKitProvider,
    useDisconnect,
} from '@reown/appkit/react'
import { BrowserProvider, formatUnits } from 'ethers'

export const useConnectWallet = () => {
    const { walletType, setWalletType } = useWalletStore()
    const { isConnected, address } = useAppKitAccount()
    const { open } = useAppKit()
    const { disconnect } = useDisconnect()
    const { walletProvider } = useAppKitProvider('eip155')

    const connectWallet = async (type: WalletType) => {
        if (!type) {
            throw new Error('Wallet type is invalid.')
        }

        try {
            setWalletType(type)

            if (isConnected) {
                await disconnect()
            }

            open()
        } catch (error) {
            console.error('Failed to connect wallet:', error)
        }
    }

    async function getBalance() {
        if (!isConnected || !walletProvider) return null
        const ethersProvider = new BrowserProvider(walletProvider as any)
        const balanceWei = await ethersProvider.getBalance(String(address))
        return formatUnits(balanceWei, 18).slice(0, 7)
    }

    return { getBalance, connectWallet, walletType }
}
