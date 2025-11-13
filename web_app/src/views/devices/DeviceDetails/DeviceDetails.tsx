import { DeviceData } from '@/utils/hooks/useGetDevices'
import { DoubleSidedImage, Loading } from '@/components/shared'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import DeviceSpecifics from './componetns/DeviceSpecifics'
import UserInfo from './componetns/UserInfo'
import { useEffect, useState } from 'react'
import { apiGetDevices, apiGetSharedWithMeDevices } from '@/services/DeviceApi'
import { apiGetUserProfileByUserId } from '@/services/UserApi'
import { Button } from '@/components/ui'
import { useAppSelector } from '@/store'
import { useMQTT } from '@/components/ui/MqttComp'
import DeviceLog from './componetns/DeviceLog'
import DevicePayload from './componetns/DevicePayload/DevicePayload'

export function convertToUserTimeZone(isoDateString: string) {
    // Create a Date object from the ISO 8601 string
    const date = new Date(isoDateString)

    // Format the date in the user's local time zone
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3, // To include milliseconds
        timeZoneName: 'short',
    } as Object

    // Create a formatter with the user's local time zone
    const formatter = new Intl.DateTimeFormat(undefined, options)

    // Format the date
    const formattedDate = formatter.format(date)

    return formattedDate
}

export function formatToCustomDateTime(convertedDateString: string) {
    // Split the convertedDateString by commas to separate date and time
    const [datePart, timePartWithTimeZone] = convertedDateString.split(', ')

    // Extract the date (MM/DD/YYYY) part and time with timezone (HH:MM:SS.mmm TimeZone)
    const [timePart] = timePartWithTimeZone.split(' ') // This will split off the timezone
    const [timeWithoutMilliseconds] = timePart.split('.') // Split by '.' to remove milliseconds

    // Construct the final string in the desired format
    const formattedDateTime = `${datePart}, ${timeWithoutMilliseconds}`

    return formattedDateTime
}

function DeviceDetails() {
    const [data, setData] = useState<DeviceData>()
    const [loading, setLoading] = useState(true)
    const [profileData, setProfileData] = useState('') as any
    const [noProfile, setNoProfile] = useState<boolean>(false)
    const { _id: userId } = useAppSelector((state) => state.auth.user)
    const { deviceId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const [deviceData, setDeviceData] = useState<Record<string, any>>({
        data: {},
        date: new Date(),
    })
    const { status, subscribe } = useMQTT()

    useEffect(() => {
        if (data?.deviceEncryptedId) {
            const unsubscribe = subscribe(
                undefined,
                data.deviceEncryptedId,
                (message: any) => {
                    let tempData = message.data
                    delete tempData.HV
                    delete tempData.FV
                    if (tempData.proof) {
                        delete tempData.proof
                    }
                    if (
                        String(message.from) === String(data.deviceEncryptedId)
                    ) {
                        setDeviceData({
                            data: { ...tempData },
                            date: new Date(),
                        })
                    }
                },
                true
            )
            return () => {
                unsubscribe()
            }
        }
    }, [data])

    // State to hold the building ID
    const [buildId, setBuildId] = useState<string | null>(
        searchParams.get('buildingId')
    )

    useEffect(() => {
        // Clear URL parameters after capturing buildId
        if (buildId) {
            setTimeout(() => {
                navigate(location.pathname, { replace: true })
            }, 0)
        }
    }, [buildId, location.pathname, navigate])

    useEffect(() => {
        async function fetchUsers() {
            setNoProfile(false)
            try {
                const response = (await apiGetDevices(userId || '')) as any
                const sharedWithMe = (await apiGetSharedWithMeDevices()) as any
                const data = [...response.data.data, ...sharedWithMe.data.data]
                const deviceData = data.filter(
                    (device: any) => device._id === deviceId
                )[0] as DeviceData

                const isNoProfile = [...sharedWithMe.data.data].find(
                    (device: any) => device._id === deviceId
                )

                if (isNoProfile) {
                    setNoProfile(true)
                }

                setData(deviceData)
                const resData = (await apiGetUserProfileByUserId(
                    userId || ''
                )) as any
                setProfileData(resData.data.data)
            } catch (error) {
                setNoProfile(true)
            }

            setLoading(false)
        }
        fetchUsers()
    }, [])

    if (loading === true) return <Loading loading={true} />

    if (loading === false && !data)
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <DoubleSidedImage
                    src="/img/others/img-2.png"
                    darkModeSrc="/img/others/img-2-dark.png"
                    alt="No product found!"
                />
                <h3 className="mt-8">No device found!</h3>
            </div>
        )

    function handleBackBt() {
        if (buildId) {
            navigate(`/buildings/details/${buildId}`)
        } else {
            navigate('/devices/my-devices')
        }
    }

    if (loading === false && data)
        return (
            <div className="flex flex-col w-full">
                {/* <div className="card card-border">
                    <MapLocation />
                </div>  */}
                <Button onClick={handleBackBt} className="w-fit">
                    Back
                </Button>
                <div className="grid grid-cols-2 gap-4 mt-8">
                    {noProfile == false && (
                        <div className="card w-full card-border col-span-1">
                            <UserInfo profileData={profileData} />
                        </div>
                    )}
                    <div
                        className={`card card-border col-span-${
                            noProfile ? 2 : 1
                        }`}
                    >
                        <DeviceSpecifics status={status} data={data} />
                    </div>
                </div>
                <DevicePayload data={data} payload={deviceData} />
                <DeviceLog deviceData={data} userId={userId} />
            </div>
        )
}

export default DeviceDetails
