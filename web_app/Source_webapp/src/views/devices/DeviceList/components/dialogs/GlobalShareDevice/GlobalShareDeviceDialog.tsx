import {
    MapContainer,
    TileLayer,
    Marker,
    useMap,
    useMapEvents,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Dialog, Button, Input, toast, Notification } from '@/components/ui'
import { useState } from 'react'
import { BsTextWrap } from 'react-icons/bs'
import { apiEditDevice, apiRenameDevice } from '@/services/DeviceApi'

// Helper Component to Locate User Position
const LocateUserButton = ({
    setLocation,
}: {
    setLocation: (position: [number, number]) => void
}) => {
    const map = useMap()

    const locateUser = () => {
        if (!navigator.geolocation) {
            return toast.push(
                <Notification type="danger">
                    {'Geolocation is not supported by your browser.'}
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                const location: [number, number] = [latitude, longitude]
                setLocation(location)
                map.setView(location, 13)
            },
            () => {
                return toast.push(
                    <Notification type="danger">
                        {'Unable to retrieve location.'}
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            }
        )
    }

    return (
        <Button
            style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                zIndex: 9999,
            }}
            size="xs"
            variant="default"
            onClick={(e) => {
                e.stopPropagation() // Prevent click event from reaching the map
                locateUser()
            }}
        >
            Go to My Location
        </Button>
    )
}

const MapClickHandler = ({
    setLocation,
}: {
    setLocation: (position: [number, number]) => void
}) => {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng
            setLocation([lat, lng])
        },
    })
    return null
}

interface GlobalShareDeviceDialogProps {
    deviceId: string
    isOpen: boolean
    onClose: () => void
    refreshPage: Function
}

const GlobalShareDeviceDialog: React.FC<GlobalShareDeviceDialogProps> = ({
    deviceId,
    isOpen,
    onClose,
    refreshPage,
}) => {
    const [apiLoading, setApiLoading] = useState<boolean>(false)
    const [location, setLocation] = useState<[number, number]>([51.505, -0.09])
    const [sharePrice, setSharePrice] = useState<number | undefined>(undefined)

    async function handleGlobalShare() {
        setApiLoading(true)
        try {
            const apiRes = await apiEditDevice(deviceId, {
                location: { type: 'Point', coordinates: location },
                isShared: true,
                costOfUse: sharePrice ? sharePrice : 0,
            })
            toast.push(
                <Notification type="success">
                    {'Device globaly shared successfully.'}
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
            setApiLoading(false)
            onClose()
            refreshPage()
        } catch (error: any) {
            setApiLoading(false)
            toast.push(
                <Notification type="danger">
                    {error.response.data.message}
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        }
    }

    return (
        <Dialog
            overlayClassName={'flex items-center'}
            isOpen={isOpen}
            closable={false}
            contentClassName="!w-1/3 flex flex-col gap-6"
            onClose={onClose}
        >
            <h3>Global Device Share</h3>
            <div className="w-full items-center flex gap-3">
                <p className="text-[0.9rem]" style={{ textWrap: 'nowrap' }}>
                    Price:{' '}
                </p>
                <Input
                    type="number"
                    value={sharePrice}
                    onChange={(e) => {
                        const value = e.target.value
                        setSharePrice(
                            value === '' ? undefined : Math.abs(Number(value))
                        ) // Set to undefined if empty
                    }}
                    placeholder="0 FDS"
                />
            </div>

            <p className="text-left text-[1.1rem]">
                Please provide your location:
            </p>
            <div className="w-full h-64">
                <MapContainer
                    center={location}
                    minZoom={3}
                    maxZoom={18}
                    maxBounds={[
                        [-90, -180],
                        [90, 180],
                    ]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {location && <Marker position={location} />}
                    {!apiLoading && (
                        <LocateUserButton setLocation={setLocation} />
                    )}
                    {!apiLoading && (
                        <MapClickHandler setLocation={setLocation} />
                    )}
                </MapContainer>
            </div>
            <div className="flex w-2/3 mx-auto justify-between">
                <Button
                    onClick={handleGlobalShare}
                    loading={apiLoading}
                    variant="solid"
                >
                    Global Share
                </Button>
                <Button
                    variant="default"
                    loading={apiLoading}
                    onClick={onClose}
                >
                    Cancel
                </Button>
            </div>
        </Dialog>
    )
}

export default GlobalShareDeviceDialog
