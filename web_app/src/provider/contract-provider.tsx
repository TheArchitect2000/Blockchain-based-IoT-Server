// StakingPoolProvider.tsx
import React, { createContext, useContext } from 'react'
import { useAppKitProvider } from '@reown/appkit/react'
import { createContractStore } from '@/store/contract/useContractStore'

const ContractContext = createContext<ReturnType<
    typeof createContractStore
> | null>(null)

export function ContractProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const { walletProvider } = useAppKitProvider('eip155')

    const store = React.useMemo(() => {
        // If wallet isn't connected, use fallback
        if (!walletProvider) {
            return createContractStore(undefined)
        }
        // Otherwise, use the signer-enabled wallet
        return createContractStore(walletProvider)
    }, [walletProvider])

    return (
        <ContractContext.Provider value={store}>
            {children}
        </ContractContext.Provider>
    )
}

export function useContractStore() {
    const context = useContext(ContractContext)
    if (!context) {
        throw new Error(
            'useContractStore must be used within <ContractProvider>'
        )
    }
    return context
}
