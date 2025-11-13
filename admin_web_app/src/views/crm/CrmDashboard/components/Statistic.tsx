import classNames from 'classnames'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import { HiOutlineTrendingUp, HiOutlineTrendingDown } from 'react-icons/hi'
import { FcShipped, FcAutomotive, FcSupport } from 'react-icons/fc'
import type { Statistic } from '../store'
import { useGetServices } from '@/utils/hooks/useGetServices'
import { useAppSelector } from '@/store'
import { useGetService } from '@/utils/hooks/useGetService'
import { useEffect, useState } from 'react'
import {
    apiGetAllInstalledServices,
    apiGetAllServices,
    apiGetInstalledServices,
} from '@/services/ServiceAPI'
import { apiGetAllUsers } from '@/services/UserApi'
import { apiGetAllDevices } from '@/services/DeviceApi'

const GrowShrink = ({ value }: { value: number }) => {
    return (
        <span className="flex items-center rounded-full gap-1">
            <span
                className={classNames(
                    'rounded-full p-1',
                    value > 0 &&
                        'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100',
                    value < 0 &&
                        'text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20'
                )}
            >
                {value > 0 && <HiOutlineTrendingUp />}
                {value < 0 && <HiOutlineTrendingDown />}
            </span>
            <span
                className={classNames(
                    'font-semibold',
                    value > 0 && 'text-emerald-600',
                    value < 0 && 'text-red-600'
                )}
            >
                {value > 0 && <>+ </>}
                {value}
            </span>
        </span>
    )
}

const StatisticIcon = ({ type }: { type?: string }) => {
    switch (type) {
        case 'allUsers':
            return (
                <Avatar
                    size={55}
                    className="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100"
                    icon={<FcSupport />}
                />
            )
        case 'allDevices':
            return (
                <Avatar
                    size={55}
                    className="bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-100"
                    icon={<FcAutomotive />}
                />
            )
        case 'allInstalledServices':
            return (
                <Avatar
                    size={55}
                    className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100"
                    icon={<FcShipped />}
                />
            )
        default:
            return <div></div>
    }
}

const StatisticCard = ({ data = {} }: { data: Partial<Statistic> }) => {
    return (
        <Card>
            <div className="flex items-center gap-4">
                <StatisticIcon type={data.key} />
                <div>
                    <div className="flex gap-1.5 items-end mb-2">
                        <h3 className="font-bold leading-none">{data.value}</h3>
                        <p className="font-semibold">{data.label}</p>
                    </div>
                    <p className="flex items-center gap-1">
                        <GrowShrink value={data.growShrink || 0} />
                        <span>this month</span>
                    </p>
                </div>
            </div>
        </Card>
    )
}

const Statistic = ({ data = [] }: { data?: Partial<Statistic>[] }) => {
    const [installedServices, setInstalledServices] = useState<any[]>([])
    const [allUsers, setAllUsers] = useState<any[]>([])
    const [allDevices, setAllDevices] = useState<any[]>([])

    useEffect(() => {
        const fetchAllDatas = async () => {
            try {
                const response = await apiGetAllInstalledServices<any>() // Fetch installed services
                const data = response.data // Extract data from AxiosResponse
                setInstalledServices(data.data) // Update state with fetched services data
            } catch (error) {
                console.error('Error fetching all installed services:', error)
            }
            try {
                const response = await apiGetAllUsers<any>()
                const data = response.data
                
                setAllUsers(data.data)
            } catch (error) {
                console.error('Error fetching all users:', error)
            }
            try {
                const response = await apiGetAllDevices<any>()
                const data = response.data
                setAllDevices(data.data)
            } catch (error) {
                console.error('Error fetching all devices:', error)
            }
        }

        fetchAllDatas()
    }, [])

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            <StatisticCard
                key={'allUsers'}
                data={{
                    key: 'allUsers',
                    label: 'All Users',
                    value: allUsers.length,
                    growShrink: 1,
                }}
            />
            <StatisticCard
                key="allDevices"
                data={{
                    key: 'allDevices',
                    label: 'All Devices',
                    value: allDevices.length,
                    growShrink: 2,
                }}
            />
            <StatisticCard
                key="allInstalledServices"
                data={{
                    key: 'allInstalledServices',
                    label: 'All Installed Services',
                    value: installedServices.length,
                    growShrink: -1,
                }}
            />
        </div>
    )
}

export default Statistic
