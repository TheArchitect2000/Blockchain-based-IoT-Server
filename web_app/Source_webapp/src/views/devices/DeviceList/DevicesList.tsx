import AdaptableCard from '@/components/shared/AdaptableCard'
import { DeviceData, useGetDevices } from '@/utils/hooks/useGetDevices'
import DeviceTable from './components/DeviceTable'
import { Loading } from '@/components/shared'
import { Tabs } from '@/components/ui'
import { ReactNode, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiGetDevices, apiGetSharedWithMeDevices } from '@/services/DeviceApi'
import { useAppSelector } from '@/store'
import { useMQTT } from '@/components/ui/MqttComp'
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
    const [sharedDevicesData, setSharedDevicesData] = useState<
        Record<string, any>
    >({})
    const [allDevicesData, setAllDevicesData] = useState<Record<string, any>>(
        {}
    )

    const { status, subscribe } = useMQTT()

    useEffect(() => {
        const unsubscribeFunctions: (() => void)[] = []

        sharedData.forEach((item) => {
            if (item?.deviceEncryptedId) {
                const unsubscribe = subscribe(
                    undefined,
                    item?.deviceEncryptedId,
                    (message: any) => {
                        let tempData = message.data
                        delete tempData.HV
                        delete tempData.FV
                        if (tempData.proof) {
                            delete tempData.proof
                        }
                        if (
                            String(message.from) ===
                            String(item.deviceEncryptedId)
                        ) {
                            console.log('Shared devices set')
                            setSharedDevicesData((prevData) => ({
                                ...prevData,
                                [String(message.from)]: {
                                    received: true,
                                    data: { ...tempData },
                                    date: new Date(),
                                },
                            }))
                            setTimeout(() => {
                                setSharedDevicesData((prevData) => ({
                                    ...prevData,
                                    [String(message.from)]: {
                                        ...prevData[String(message.from)],
                                        received: false,
                                    },
                                }))
                            }, 2000)
                        }
                    },
                    true
                )
                unsubscribeFunctions.push(unsubscribe)
            }
        })

        allDevices.forEach((item) => {
            if (item?.deviceEncryptedId) {
                const unsubscribe = subscribe(
                    undefined,
                    item?.deviceEncryptedId,
                    (message: any) => {
                        let tempData = message.data
                        delete tempData.HV
                        delete tempData.FV
                        if (tempData.proof) {
                            delete tempData.proof
                        }
                        if (
                            String(message.from) ===
                            String(item.deviceEncryptedId)
                        ) {
                            console.log('All devices set')
                            setAllDevicesData((pervData) => ({
                                ...pervData,
                                [String(message.from)]: {
                                    received: true,
                                    data: { ...tempData },
                                    date: new Date(),
                                },
                            }))
                            setTimeout(() => {
                                setAllDevicesData((prevData) => ({
                                    ...prevData,
                                    [String(message.from)]: {
                                        ...prevData[String(message.from)],
                                        received: false,
                                    },
                                }))
                            }, 2000)
                        }
                    },
                    true
                )
                unsubscribeFunctions.push(unsubscribe)
            }
        })

        // Cleanup function to unsubscribe all
        return () => {
            unsubscribeFunctions.forEach((unsubscribe) => unsubscribe())
        }
    }, [sharedData, allDevices])

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
                        nft: true
                    }}
                    deviceList={allDevices}
                    payloads={allDevicesData}
                    refreshPage={refreshPage}
                />
            ),
        },
        {
            label: 'Local Device Sharing',
            path: 'local-share-devices',
            element: (
                <DeviceTable
                    key={`local-shared-${refreshComponents}`}
                    type="local shared"
                    options={{ sharedUsers: true }}
                    deviceList={allDevices.filter(
                        (item) => item.sharedWith.length > 0
                    )}
                    payloads={allDevicesData}
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
                    type="global shared"
                    options={{ unshare: true }}
                    deviceList={allDevices.filter(
                        (item) => item.isShared == true
                    )}
                    payloads={allDevicesData}
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
                    type="shared"
                    options={{ view: true }}
                    deviceList={sharedData}
                    payloads={sharedDevicesData}
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
                                <div className="w-full h-full pt-4 text-white">
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
