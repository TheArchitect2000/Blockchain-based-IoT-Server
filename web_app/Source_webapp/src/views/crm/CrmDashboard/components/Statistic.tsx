import classNames from 'classnames'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import { HiOutlineTrendingUp, HiOutlineTrendingDown } from 'react-icons/hi'
import { FcShipped, FcAutomotive, FcSupport } from 'react-icons/fc'
import type { Statistic } from '../store'
import { useAppSelector } from '@/store'
import { useEffect, useState } from 'react'
import {
    apiGetAllPublishedServices,
    apiGetInstalledServices,
    apiGetService,
} from '@/services/ServiceAPI'
import { Loading } from '@/components/shared'

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
        case 'myServices':
            return (
                <Avatar
                    size={55}
                    className="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100"
                    icon={<FcSupport />}
                />
            )
        case 'market':
            return (
                <Avatar
                    size={55}
                    className="bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-100"
                    icon={<FcAutomotive />}
                />
            )
        case 'installed':
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
    const { _id: userId } = useAppSelector((state) => state.auth.user)
    const [myServices, setMyServices] = useState<any[]>([])
    const [allServices, setAllServices] = useState<any[]>([])
    const [installedServices, setInstalledServices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAllDatas = async () => {
            try {
                const myRes = await apiGetService<any>(userId || '') // Fetch installed services
                const myData = myRes.data // Extract data from AxiosResponse
                setMyServices(myData.data) // Update state with fetched services data

                const marketRes = await apiGetAllPublishedServices<any>()
                const marketData = marketRes.data
                setAllServices(marketData.data)

                const installedRes = await apiGetInstalledServices<any>(
                    userId || ''
                )
                const installedData = installedRes.data
                setInstalledServices(installedData.data)

                setLoading(false)
            } catch (error) {
                console.error(
                    'Error while fetching datas ( my services, service market, installed services ):',
                    error
                )
            }
        }

        fetchAllDatas()
    }, [])

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            <StatisticCard
                key={'myServices'}
                data={{
                    key: 'myServices',
                    label: 'My Services',
                    value: loading ? (
                        <Loading size={25} loading={true} />
                    ) : (
                        myServices.length
                    ),
                    growShrink: 1,
                }}
            />
            <StatisticCard
                key="market"
                data={{
                    key: 'market',
                    label: 'Service Market',
                    value: loading ? (
                        <Loading size={25} loading={true} />
                    ) : (
                        allServices.length
                    ),
                    growShrink: 2,
                }}
            />

            <StatisticCard
                key="installed"
                data={{
                    key: 'installed',
                    label: 'Installed Service',
                    value: loading ? (
                        <Loading size={25} loading={true} />
                    ) : (
                        installedServices.length
                    ),
                    growShrink: -1,
                }}
            />
        </div>
    )
}

export default Statistic
