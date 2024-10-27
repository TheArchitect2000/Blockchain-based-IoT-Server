import { Dialog, Button } from '@/components/ui'

interface GlobalUnshareDeviceDialogProps {
    loading: boolean
    isOpen: boolean
    onClose: () => void
    onUnshare: () => void
    deviceName: string
}

const GlobalUnshareDeviceDialog: React.FC<GlobalUnshareDeviceDialogProps> = ({
    loading,
    isOpen,
    onClose,
    onUnshare,
    deviceName,
}) => {
    return (
        <Dialog
            overlayClassName={'flex items-center'}
            isOpen={isOpen}
            closable={false}
            contentClassName="!w-1/3"
            onClose={onClose}
        >
            <h3 className="mb-8">Global Unshare Device</h3>
            <p className="text-left text-[1.1rem] mb-8">
                Are you sure you want to global unshare your "{deviceName}"
                device?
            </p>

            <div className="flex w-2/3 mx-auto justify-between">
                <Button loading={loading} onClick={onUnshare} variant="solid" color="red">
                    Unshare
                </Button>
                <Button loading={loading} onClick={onClose} variant="default">
                    Cancel
                </Button>
            </div>
        </Dialog>
    )
}

export default GlobalUnshareDeviceDialog
