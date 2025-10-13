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
import { GoogleOAuthProvider } from '@react-oauth/google'

const environment = process.env.NODE_ENV

/**
 * Set enableMock(Default false) to true at configs/app.config.js
 * If you wish to enable mock api
 */
if (environment !== 'production' && appConfig.enableMock) {
    mockServer({ environment })
}

const STALE_TIME_SECONDS = Infinity

function App() {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { staleTime: STALE_TIME_SECONDS } },
    })

    return (
        <QueryClientProvider client={queryClient}>
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
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

export default App
