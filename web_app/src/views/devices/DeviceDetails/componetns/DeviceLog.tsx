import { Loading } from '@/components/shared'
import { Card, DatePicker } from '@/components/ui'
import Table2D from '@/views/account/Settings/components/Table2D'
import { convertToTimeZone } from '@/views/account/Settings/components/TimezoneSelector'
import { convertToUserTimeZone } from '../DeviceDetails'
import { apiGetDeviceLogByEncryptedIdAndNumberOfDays } from '@/services/DeviceApi'
import { DeviceData } from '@/utils/hooks/useGetDevices'
import { useEffect, useState } from 'react'
import { apiGetUserProfileByUserId } from '@/services/UserApi'
import Chart from '@/views/account/Settings/components/ReChart'

export default function DeviceLog({
    userId,
    deviceData,
}: {
    userId: string | undefined
    deviceData: DeviceData
}) {
    const [logLoading, setLogLoading] = useState(false) as any
    const [chartData, setChartData] = useState([]) as any

    async function changeLogDatas(days = 0, profData: any = null) {
        setLogLoading(true)
        let encryptId = ''
        if (deviceData) {
            encryptId = deviceData?.deviceEncryptedId
        }
        const logRes = (await apiGetDeviceLogByEncryptedIdAndNumberOfDays(
            encryptId,
            days
        )) as any

        let tempChartData = logRes.data?.data

        let allTempDatas: any = {
            chart: [],
            motion: [],
            button: [],
            door: [],
        }

        tempChartData.map((item: any) => {
            let userDate = new Date()

            if (profData && profData.timezone) {
                userDate = new Date(
                    convertToTimeZone(item.insertDate, profData.timezone)
                )
            } else {
                userDate = new Date(convertToUserTimeZone(item.insertDate))
            }

            const hours = userDate.getHours().toString().padStart(2, '0')
            const minutes = userDate.getMinutes().toString().padStart(2, '0')

            if (item.data?.Temperature && item.data?.Humidity) {
                allTempDatas.chart.push({
                    insertDate: `${hours}:${minutes}`,
                    Temperature: item.data?.Temperature || '',
                    Humidity: item.data?.Humidity || '',
                })
            } else {
                allTempDatas.chart.push({
                    insertDate: `${hours}:${minutes}`,
                })
            }

            if (item.data?.Button && item.data?.Button === 'Pressed') {
                allTempDatas.button.push({
                    Time: `${hours}:${minutes}`,
                    Button: item.data?.Button || '',
                })
            }

            if (item.data?.Movement && item.data?.Movement === 'Detected') {
                allTempDatas.motion.push({
                    Time: `${hours}:${minutes}`,
                    Movement: item.data?.Movement || '',
                })
            }

            if (item.data?.Door) {
                allTempDatas.door.push({
                    Time: `${hours}:${minutes}`,
                    Door: item.data?.Door || '',
                })
            }
        })

        setChartData(allTempDatas)
        setLogLoading(false)
    }

    useEffect(() => {
        async function fetchUsers() {
            try {
                const resData = (await apiGetUserProfileByUserId(
                    userId || ''
                )) as any

                changeLogDatas(0, resData.data.data)
            } catch (error) {}
        }
        fetchUsers()
    }, [])

    function handleDateChange(date: Date) {
        const selectedDate = new Date(date)
        const nowDate = new Date()
        const timeDifference = nowDate.getTime() - selectedDate.getTime()
        const daysDifference = Math.floor(
            timeDifference / (1000 * 60 * 60 * 24)
        )
        changeLogDatas(daysDifference)
    }

    return (
        <>
            <Card
                bodyClass="flex flex-col gap-10 py-10"
                className=" w-full min-h-[65dvh] mt-10 card card-border"
            >
                <h1 className="ms-10">Device Log</h1>
                <div className="flex px-10">
                    <DatePicker
                        disabled={logLoading}
                        onChange={handleDateChange as any}
                        maxDate={new Date()}
                        minDate={new Date('2023/1/1')}
                        clearable={false}
                        defaultValue={new Date()}
                    />
                </div>
                {(logLoading && (
                    <div className="flex items-center justify-center w-full h-[40dvh]">
                        <Loading loading={true} />
                    </div>
                )) || <Chart data={chartData.chart} loading={logLoading} />}
            </Card>

            {logLoading == false &&
                ((chartData?.door?.length || 0) !== 0 ||
                    (chartData?.motion?.length || 0) !== 0 ||
                    (chartData?.button?.length || 0) !== 0) && (
                    <Card
                        bodyClass="flex h-full justify-center px-5 gap-5 py-10"
                        className="w-full min-h-[65dvh] mt-10 card card-border"
                    >
                        {(logLoading && <Loading loading={true} />) || (
                            <>
                                {chartData?.button &&
                                    chartData?.button.length > 0 && (
                                        <div className="w-1/3 h-full">
                                            <Table2D
                                                data={chartData.button}
                                                rowsPerPage={10}
                                            />
                                        </div>
                                    )}
                                {chartData?.motion &&
                                    chartData?.motion.length > 0 && (
                                        <div className="w-1/3 h-full">
                                            <Table2D
                                                data={chartData?.motion}
                                                rowsPerPage={10}
                                            />
                                        </div>
                                    )}
                                {chartData?.door &&
                                    chartData?.door.length > 0 && (
                                        <div className="w-1/3 h-full">
                                            <Table2D
                                                data={chartData?.door}
                                                rowsPerPage={10}
                                            />
                                        </div>
                                    )}
                            </>
                        )}
                    </Card>
                )}
        </>
    )
}
