import { useState, useEffect, Suspense, lazy } from 'react'
import Tabs from '@/components/ui/Tabs'
import AdaptableCard from '@/components/shared/AdaptableCard'
import Container from '@/components/shared/Container'
import { useNavigate, useLocation } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import { apiGetAccountSettingData } from '@/services/AccountServices'

type AccountSetting = {
    profile: {
        name: string
        email: string
        title: string
        avatar: string
        timeZone: string
        lang: string
        syncData: boolean
    }
    loginHistory: {
        type: string
        deviceName: string
        time: number
        location: string
    }[]
}

type GetAccountSettingData = AccountSetting

const Profile = lazy(() => import('./components/Profile'))
const Address = lazy(() => import('./components/Address'))
const Password = lazy(() => import('./components/Password'))
const Verify = lazy(() => import('./components/Verify'))

const { TabNav, TabList } = Tabs

const settingsMenu: Record<
    string,
    {
        label: string
        path: string
    }
> = {
    profile: { label: 'Profile', path: 'profile' },
    address: { label: 'Address', path: 'address' },
    verify: { label: 'Verify', path: 'verify' },
    password: { label: 'Password', path: 'password' },
}

const Settings = () => {
    const [currentTab, setCurrentTab] = useState('profile')
    const [data, setData] = useState<Partial<AccountSetting>>({})

    const navigate = useNavigate()

    const location = useLocation()

    const path = location.pathname.substring(
        location.pathname.lastIndexOf('/') + 1
    )

    const onTabChange = (val: string) => {
        console.log(val)

        setCurrentTab(val)
        navigate(`/account/settings/${val}`)
    }

    const fetchData = async () => {
        const response = await apiGetAccountSettingData<GetAccountSettingData>()
        setData(response.data)
    }

    useEffect(() => {
        setCurrentTab(path)
        if (isEmpty(data)) {
            fetchData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Container>
            <AdaptableCard>
                <Tabs value={currentTab} onChange={(val) => onTabChange(val)}>
                    <TabList>
                        {Object.keys(settingsMenu).map((key) => (
                            <TabNav key={key} value={key}>
                                {settingsMenu[key].label}
                            </TabNav>
                        ))}
                    </TabList>
                </Tabs>
                <div className="px-4 py-6">
                    <Suspense fallback={<></>}>
                        {currentTab === 'profile' && (
                            <Profile data={data.profile as any} />
                        )}
                        {currentTab === 'password' && (
                            <Password />
                        )}
                        {currentTab === 'verify' && (
                            <Verify />
                        )}
                        {currentTab === 'address' && <Address />}
                    </Suspense>
                </div>
            </AdaptableCard>
        </Container>
    )
}

export default Settings
