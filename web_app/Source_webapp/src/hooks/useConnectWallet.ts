import { useWalletStore, WalletType } from '@/store/user/useWalletStore'
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react'

export const useConnectWallet = () => {
    const { walletType, setWalletType } = useWalletStore()
    const { isConnected } = useAppKitAccount()
    const { open } = useAppKit()
    const { disconnect } = useDisconnect()

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

    return { connectWallet, walletType }
}
