import { FaIdCard, FaWallet, FaCoins } from 'react-icons/fa'
import { Loading } from '@/components/shared'
import { useAppSelector } from '@/store'
import { useState, useEffect } from 'react'
import { apiGetMyProfile } from '@/services/UserApi'
import { useAppKitAccount } from '@reown/appkit/react'
import { useConnectWallet } from '@/hooks/useConnectWallet'

export default function UserNFTAssets() {
    const themeColor = useAppSelector((state) => state.theme.themeBackground)
    const [loading, setLoading] = useState(true)
    const [userProfile, setUserProfile] = useState<any>({})
    const [walletBalance, setWalletBalance] = useState<string | number>(0)

    const { isConnected, address } = useAppKitAccount()
    const { walletType, getBalance: getWalletBalance } = useConnectWallet()

    async function getBalance() {
        const balance = await getWalletBalance()
        setWalletBalance(balance || 0)
    }

    async function fetchData() {
        try {
            const userProfile = (await apiGetMyProfile()) as any
            const theProfile = userProfile.data.data
            setUserProfile(theProfile)

            if (isConnected && walletType === 'ownership') {
                await getBalance()
            }
        } catch (error) {
            console.error('Error fetching profile:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [isConnected, walletType])

    return (
        <>
            {!loading ? (
                <div className="w-full flex flex-col gap-4">
                    <h4>Your Assets</h4>
                    <div className="flex flex-wrap justify-around gap-6">
                        {/* Identity Wallet Box */}
                        <section
                            className={`flex flex-col gap-4 bg-${themeColor} rounded-lg p-4 shadow-[0_0_7px_2px_rgba(31,41,55,0.9)] min-w-[300px]`}
                        >
                            <div className="flex items-center gap-3">
                                <FaIdCard className="text-xl" />
                                <h5>Identity Wallet</h5>
                            </div>
                            {userProfile.identityWallet ? (
                                <p className="break-all">
                                    Address:{' '}
                                    <span className="text-white">
                                        {userProfile.identityWallet}
                                    </span>
                                </p>
                            ) : (
                                <p className="text-white">Not registered.</p>
                            )}
                        </section>

                        {/* Ownership Wallet Box */}
                        <section
                            className={`flex flex-col gap-4 bg-${themeColor} rounded-lg p-4 shadow-[0_0_7px_2px_rgba(31,41,55,0.9)] min-w-[300px]`}
                        >
                            <div className="flex items-center gap-3">
                                <FaWallet className="text-xl" />
                                <h5>Ownership Wallet</h5>
                            </div>
                            {userProfile.ownerShipWallets?.length > 0 ? (
                                <p className="break-all">
                                    Address:{' '}
                                    <span className="text-white">
                                        {userProfile.ownerShipWallets[0]}
                                    </span>
                                </p>
                            ) : (
                                <p className="text-white">Not registered.</p>
                            )}
                        </section>

                        {/* Balance Box */}
                        <section
                            className={`flex flex-col gap-4 bg-${themeColor} rounded-lg p-4 shadow-[0_0_7px_2px_rgba(31,41,55,0.9)] min-w-[300px]`}
                        >
                            <div className="flex items-center gap-3">
                                <FaCoins className="text-xl" />
                                <h5>Ownership Balance</h5>
                            </div>
                            {(isConnected && walletType == 'ownership' && (
                                <p className="break-all">
                                    Balance:{' '}
                                    <span className="text-white">
                                        {walletBalance}
                                    </span>
                                </p>
                            )) || <p>Not Connected.</p>}
                        </section>
                    </div>
                </div>
            ) : (
                <div className="w-full h-[60dvh]">
                    <Loading loading={true} />
                </div>
            )}
        </>
    )
}
