import { create } from 'zustand'

export type WalletType = 'identity' | 'ownership' | undefined

interface WalletStore {
    walletType: WalletType
    setWalletType: (type: WalletType) => void
}

export const useWalletStore = create<WalletStore>((set) => ({
    walletType: undefined,
    setWalletType: (type: WalletType) => set({ walletType: type }),
}))
