import AdaptableCard from '@/components/shared/AdaptableCard'
import { DeviceData, useGetDevices } from '@/utils/hooks/useGetDevices'
import DeviceTable from './components/DeviceTable'
import { Loading } from '@/components/shared'
import { Tabs } from '@/components/ui'
import { ReactNode, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiGetDevices, apiGetSharedWithMeDevices } from '@/services/DeviceApi'
import { useAppSelector } from '@/store'
const { TabNav, TabList } = Tabs

const ProductList = () => {
    const [refreshData, setRefreshData] = useState<number>(0)
    const [refreshComponents, setRefreshComponents] = useState<number>(0)
    const [sharedData, setSharedData] = useState<Array<DeviceData>>([])
    const [allDevices, setAllDevices] = useState<Array<DeviceData>>([])
    const [apiLoading, setApiLoading] = useState<boolean>(true)
    const { _id: userId } = useAppSelector((state) => state.auth.user)
    const navigate = useNavigate()
    const location = useLocation()

    function refreshPage() {
        setRefreshData(refreshData + 1)
    }

    function refreshDeviceComponents() {
        setRefreshComponents(refreshComponents + 1)
    }

    const deviceMenu: Array<{
        label: string
        path: string
        className?: string
        element: ReactNode
    }> = [
        {
            label: 'All Devices',
            path: 'my-devices',
            element: (
                <DeviceTable
                    key={`all-${refreshComponents}`}
                    type="all"
                    options={{
                        view: true,
                        share: true,
                        delete: true,
                        edit: true,
                    }}
                    deviceList={allDevices}
                    refreshPage={refreshPage}
                />
            ),
        },
        {
            label: 'Local Device Sharing',
            path: 'local-share-devices',
            element: (
                <DeviceTable
                    key={`local-share-${refreshComponents}`}
                    type="local share"
                    options={{ sharedUsers: true }}
                    deviceList={allDevices.filter(
                        (item) => item.sharedWith.length > 0
                    )}
                    refreshPage={refreshPage}
                />
            ),
        },
        {
            label: 'Global Device Sharing',
            path: 'global-share-devices',
            element: (
                <DeviceTable
                    key={`global-share-${refreshComponents}`}
                    type="global share"
                    options={{ unshare: true }}
                    deviceList={allDevices.filter(
                        (item) => item.isShared == true
                    )}
                    refreshPage={refreshPage}
                />
            ),
        },
        {
            label: 'Shared With Me',
            path: 'shared-devices',
            element: (
                <DeviceTable
                    key={`share-${refreshComponents}`}
                    type="share"
                    options={{ view: true }}
                    deviceList={sharedData}
                    refreshPage={refreshPage}
                />
            ),
        },
    ]

    const [currentTab, setCurrentTab] = useState(deviceMenu[0].path)

    const path = location.pathname.substring(
        location.pathname.lastIndexOf('/') + 1
    )

    const onTabChange = (val: string) => {
        setCurrentTab(val)
        navigate(`/devices/${val}`)
    }

    async function fetchData() {
        setApiLoading(true)
        const sharedDevices = (await apiGetSharedWithMeDevices()) as any
        setSharedData(sharedDevices.data.data)
        const allDevices = (await apiGetDevices(String(userId))) as any
        setAllDevices(allDevices.data.data)
        setApiLoading(false)
        setCurrentTab(path)
        refreshDeviceComponents()
    }

    useEffect(() => {
        fetchData()
    }, [refreshData])

    return (
        <main className="flex flex-col gap-4 h-full">
            <h3>Device List</h3>
            <AdaptableCard className="h-full p-6">
                {apiLoading && (
                    <div className="w-full h-[60dvh] flex items-center justify-center">
                        <Loading loading={true} />
                    </div>
                )}
                {!apiLoading && (
                    <Tabs
                        value={currentTab}
                        onChange={(val) => onTabChange(val)}
                    >
                        <TabList>
                            {deviceMenu.map((menuItem, index) => (
                                <TabNav
                                    className={menuItem.className || ''}
                                    key={index}
                                    value={menuItem.path}
                                >
                                    {menuItem.label}
                                </TabNav>
                            ))}
                        </TabList>
                    </Tabs>
                )}
                {!apiLoading &&
                    deviceMenu.map((menuItem, index) => {
                        if (currentTab == menuItem.path) {
                            return (
                                <div className="w-full h-full pt-4">
                                    {menuItem.element}
                                </div>
                            )
                        }
                    })}
            </AdaptableCard>
        </main>
    )
}

export default ProductList
