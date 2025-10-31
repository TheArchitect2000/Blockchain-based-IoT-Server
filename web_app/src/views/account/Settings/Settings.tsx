import { useState, useEffect, Suspense, lazy } from 'react'
import Tabs from '@/components/ui/Tabs'
import AdaptableCard from '@/components/shared/AdaptableCard'
import Container from '@/components/shared/Container'
import { useNavigate, useLocation } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import { apiGetAccountSettingData } from '@/services/AccountServices'
import CompanyDeveloperPage from './components/CompanyDeveloper'

const Profile = lazy(() => import('./components/Profile/Profile'))
const Address = lazy(() => import('./components/Address'))
const Password = lazy(() => import('./components/Password'))
const Verify = lazy(() => import('./components/Verify'))
const Subscriptions = lazy(() => import('./components/Subscriptions'))
const StorX = lazy(() => import('./components/StorX/StorX'))
const DeleteAccount = lazy(() => import('./components/DeleteAccount'))
const DigitalIdentity = lazy(() => import('./components/DigitalIdentity'))
const DigitalTwin = lazy(() => import('./components/DigitalTwin'))

const { TabNav, TabList } = Tabs

const settingsMenu: Record<
    string,
    {
        label: string
        path: string
        className?: string
        element: any
    }
> = {
    profile: { label: 'Profile', path: 'profile', element: <Profile /> },
    'digital-identity': {
        label: 'Decentralized Identifier',
        path: 'digital-identity',
        element: <DigitalIdentity />,
    },
    'digital-twin': {
        label: 'Digital Twin',
        path: 'digital-twin',
        element: <DigitalTwin />,
    },
    address: { label: 'Address', path: 'address', element: <Address /> },
    /* verify: { label: 'Verify', path: 'verify' }, */
    subscriptions: {
        label: 'Subscriptions',
        path: 'subscriptions',
        element: <Subscriptions />,
    },
    storx: { label: 'StorX', path: 'storx', element: <StorX /> },
    password: { label: 'Password', path: 'password', element: <Password /> },
    developer: {
        label: 'IoT Developer (optional)',
        path: 'developer',
        element: <CompanyDeveloperPage />,
    },
    deleteaccount: {
        label: 'Delete Account',
        path: 'deleteaccount',
        element: <DeleteAccount />,
    },
}

const Settings = () => {
    const [currentTab, setCurrentTab] = useState('profile')

    const navigate = useNavigate()

    const location = useLocation()

    const path = location.pathname.substring(
        location.pathname.lastIndexOf('/') + 1
    )

    const onTabChange = (val: string) => {
        setCurrentTab(val)
        navigate(`/account/settings/${val}`)
    }

    useEffect(() => {
        setCurrentTab(path)
    }, [])

    return (
        <Container>
            <AdaptableCard className="p-4">
                <Tabs value={currentTab} onChange={(val) => onTabChange(val)}>
                    <TabList>
                        {Object.keys(settingsMenu).map((key) => (
                            <TabNav
                                className={
                                    (settingsMenu[key].className &&
                                        settingsMenu[key].className) ||
                                    ''
                                }
                                key={key}
                                value={key}
                            >
                                {settingsMenu[key].label}
                            </TabNav>
                        ))}
                    </TabList>
                </Tabs>
                <div className="px-4 py-6">
                    <Suspense fallback={<div>loading...</div>}>
                        {Object.keys(settingsMenu).map((key) => {
                            if (settingsMenu[key].path === currentTab) {
                                return settingsMenu[key].element
                            }
                        })}
                        {/* {currentTab === 'verify' && <Verify />} */}
                    </Suspense>
                </div>
            </AdaptableCard>
        </Container>
    )
}

export default Settings
