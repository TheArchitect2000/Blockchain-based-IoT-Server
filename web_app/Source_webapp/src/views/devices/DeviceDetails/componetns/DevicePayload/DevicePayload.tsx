import { Card } from '@/components/ui'
import { apiGetLastDeviceLogByEncryptedId } from '@/services/DeviceApi'
import { DeviceData } from '@/utils/hooks/useGetDevices'
import { useEffect, useState } from 'react'
import { Loading } from '@/components/shared'
import './style.scss'

export function formatDate(isoDate: string) {
    const date = new Date(isoDate)
    const formattedDate = `${date.getFullYear()}/${String(
        date.getMonth() + 1
    ).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
    const formattedTime = `${date.getHours()}:${String(
        date.getMinutes()
    ).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
    return `${formattedDate} , ${formattedTime}`
}

export default function DevicePayload({
    data,
    payload,
}: {
    data: DeviceData
    payload: Record<string, any>
}) {
    const [logLoading, setLogLoading] = useState(true) as any
    const [lastLog, setLastLog] = useState<any>()
    const [isReceived, setIsReceived] = useState(false)

    useEffect(() => {
        async function fetchData() {
            const res = (await apiGetLastDeviceLogByEncryptedId(
                data.deviceEncryptedId
            )) as any
            let lastData = res.data.data
            delete lastData.data.HV
            delete lastData.data.FV
            if (lastData.data.proof) {
                delete lastData.data.proof
            }

            setLastLog({
                date: lastData.insertDate,
                data: {
                    ...lastData.data,
                },
            })
            setLogLoading(false)
        }
        fetchData()
    }, [])

    useEffect(() => {
        // Detect payload date change
        if (payload?.date && lastLog?.date && payload.date !== lastLog.date) {
            setIsReceived(true)
            setTimeout(() => setIsReceived(false), 1000) // Remove class after 1 second
        }
    }, [payload?.date])

    return (
        <Card
            bodyClass="flex flex-col gap-10 p-10"
            className=" w-full min-h-[40dvh] mt-10 card card-border"
        >
            <h1>Device Live Payload</h1>

            {(logLoading && (
                <div className="flex items-center justify-center w-full h-[40dvh]">
                    <Loading loading={true} />
                </div>
            )) || (
                <>
                    {(Object.keys(payload.data).length === 0 && (
                        <div className="device-payload-holder">
                            {lastLog.data &&
                                Object.keys(lastLog.data).map((key: string) => {
                                    return (
                                        <div className="item" key={key}>
                                            <h1>{key} :</h1>
                                            <p>{String(lastLog.data[key])}</p>
                                        </div>
                                    )
                                })}
                            <h6 className="col-span-full flex justify-center">
                                The latest data received at:{' '}
                                {formatDate(lastLog.date)}
                            </h6>
                        </div>
                    )) || (
                        <div className={`device-payload-holder `}>
                            {payload &&
                                Object.keys(payload.data).map((key: string) => {
                                    return (
                                        <div
                                            className={`item ${
                                                isReceived ? 'received' : ''
                                            }`}
                                            key={key}
                                        >
                                            <h1>{key} :</h1>
                                            <p>{String(payload.data[key])}</p>
                                        </div>
                                    )
                                })}
                            <h6 className="col-span-full flex justify-center">
                                The latest data received at:{' '}
                                {formatDate(payload.date)}
                            </h6>
                        </div>
                    )}
                </>
            )}
        </Card>
    )
}
