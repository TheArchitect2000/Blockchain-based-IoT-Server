import { AdaptableCard, Loading } from '@/components/shared'
import {
    apiGetAdminWalletData,
    apiGetFaucetWalletData,
} from '@/services/ContractService'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCheckPage } from '../security/CheckPage'

export default function WalletAccounts() {
    const [loading, setLoading] = useState<boolean>(true)
    const [faucetData, setFaucetData] = useState<any>({
        address: '',
        balance: 0,
    })
    const [adminData, setAdminData] = useState<any>({
        address: '',
        balance: 0,
    })

    const navigateTo = useNavigate()
    const { loading: roleLoading, result } = useCheckPage('super')
    if (roleLoading == false) {
        if (result == false) {
            navigateTo('/')
        }
    }

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            const adminRes = (await apiGetAdminWalletData()) as any
            const faucetRes = (await apiGetFaucetWalletData()) as any
            setFaucetData(faucetRes.data.data)
            setAdminData(adminRes.data.data)
            setLoading(false)
        }
        fetchData()
    }, [])

    return (
        <main className="flex flex-col gap-6">
            <h3>Wallet Accounts</h3>
            {(loading && (
                <div className="flex h-screen w-full items-center justify-center">
                    <Loading loading={true} />
                </div>
            )) || (
                <section className="flex gap-4">
                    <AdaptableCard
                        className="p-6 w-1/2"
                        bodyClass="flex flex-col gap-2 text-[1.05rem]"
                    >
                        <p>
                            Admin wallet balance:{' '}
                            <span className="text-white">
                                {adminData.balance}
                            </span>
                        </p>
                        <p>
                            Admin wallet address:{' '}
                            <span className="text-white">
                                {adminData.address}
                            </span>
                        </p>
                    </AdaptableCard>
                    <AdaptableCard
                        className="p-6 w-1/2"
                        bodyClass="flex flex-col gap-2 text-[1.05rem]"
                    >
                        <p>
                            Faucet wallet balance:{' '}
                            <span className="text-white">
                                {faucetData.balance}
                            </span>
                        </p>
                        <p>
                            Faucet wallet address:{' '}
                            <span className="text-white">
                                {faucetData.address}
                            </span>
                        </p>
                    </AdaptableCard>
                </section>
            )}
        </main>
    )
}
