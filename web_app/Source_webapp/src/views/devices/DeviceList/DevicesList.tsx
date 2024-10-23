import AdaptableCard from '@/components/shared/AdaptableCard'
import { DeviceData, useGetDevices } from '@/utils/hooks/useGetDevices'
import DeviceTable from './components/DeviceTable'
import { Loading } from '@/components/shared'
import { Tabs } from '@/components/ui'
import { ReactNode, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiGetSharedWithMeDevices } from '@/services/DeviceApi'
const { TabNav, TabList } = Tabs

const ProductList = () => {
    const [sharedData, setSharedData] = useState<Array<DeviceData>>([])
    const { status, refresh } = useGetDevices()
    const loading = status !== 'success'

    const deviceMenu: Array<{
        label: string
        path: string
        className?: string
        element: ReactNode
    }> = [
        {
            label: 'All Devices',
            path: 'my-devices',
            element: <DeviceTable refreshPage={refresh} />,
        },
        {
            label: 'Shared With Me',
            path: 'shared-devices',
            element: (
                <DeviceTable sharedDevice={sharedData} refreshPage={refresh} />
            ),
        },
    ]

    const [currentTab, setCurrentTab] = useState(deviceMenu[0].path)
    const [refreshData, setRefreshData] = useState<number>(0)

    const navigate = useNavigate()
    const location = useLocation()

    const path = location.pathname.substring(
        location.pathname.lastIndexOf('/') + 1
    )

    const onTabChange = (val: string) => {
        setCurrentTab(val)
        navigate(`/devices/${val}`)
        setRefreshData(refreshData + 1)
    }

    async function fetchData() {
        const res = (await apiGetSharedWithMeDevices()) as any
        setSharedData(res.data.data)
    }

    useEffect(() => {
        fetchData()
        setCurrentTab(path)
    }, [refreshData])

    if (loading) return <Loading loading={loading} />

    return (
        <main className="flex flex-col gap-4 h-full">
            <h3>Device List</h3>
            <AdaptableCard className="h-full p-6">
                <Tabs value={currentTab} onChange={(val) => onTabChange(val)}>
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
                {deviceMenu.map((menuItem, index) => {
                    if (currentTab == menuItem.path)
                        return (
                            <div className="w-full h-full pt-4">
                                {menuItem.element}
                            </div>
                        )
                })}
            </AdaptableCard>
        </main>
    )
}

export default ProductList
