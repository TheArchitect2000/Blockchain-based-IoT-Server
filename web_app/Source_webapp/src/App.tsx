import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from './store'
import Theme from '@/components/template/Theme'
import Layout from '@/components/layouts'
import mockServer from './mock'
import appConfig from '@/configs/app.config'
import './locales'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
const environment = process.env.NODE_ENV
import { createAppKit } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { defineChain } from '@reown/appkit/networks'
import { ContractProvider } from './provider/contract-provider'
import { GoogleOAuthProvider } from '@react-oauth/google'

if (environment !== 'production' && appConfig.enableMock) {
    mockServer({ environment })
}

const STALE_TIME_SECONDS = Infinity

// 1. Get projectId
const projectId = '4c42b5bbf66a6cb3131e03b4f48f63f7'

const customNetwork = defineChain({
    id: 706883,
    caipNetworkId: 'eip155:706883',
    chainNamespace: 'eip155',
    name: 'FidesInnova',
    testnet: true,
    nativeCurrency: {
        decimals: 18,
        name: 'Fides',
        symbol: 'FDS',
    },
    rpcUrls: {
        default: {
            http: [import.meta.env.VITE_RPC_URL],
            webSocket: [import.meta.env.VITE_RPC_URL],
        },
    },
    blockExplorers: {
        default: { name: 'Explorer', url: 'https://explorer.fidesinnova.io/' },
    },
})

// 4. Create a AppKit instance
createAppKit({
    adapters: [new EthersAdapter()],
    networks: [customNetwork],
    projectId,
    features: {
        analytics: false,
        socials: false,
        email: false,
        allWallets: true,
    },
})

function App() {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { staleTime: STALE_TIME_SECONDS } },
    })

    return (
        <QueryClientProvider client={queryClient}>
            <ContractProvider>
                <Provider store={store}>
                    <GoogleOAuthProvider clientId="990952057079-r35cambumvgrl8pqcvegi676gplmilq2.apps.googleusercontent.com">
                        <PersistGate loading={null} persistor={persistor}>
                            <BrowserRouter>
                                <Theme>
                                    <Layout />
                                </Theme>
                            </BrowserRouter>
                        </PersistGate>
                    </GoogleOAuthProvider>
                </Provider>
            </ContractProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

export default App
