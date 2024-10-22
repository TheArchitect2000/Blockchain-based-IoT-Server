import { Dialog, Button, Input } from '@/components/ui'

interface RenameDeviceDialogProps {
    isOpen: boolean
    onClose: () => void
    onRename: () => void
    loading: boolean
    deviceName: string
    setNewDeviceName: (name: string) => void
}

const RenameDeviceDialog: React.FC<RenameDeviceDialogProps> = ({
    isOpen,
    onClose,
    onRename,
    loading,
    deviceName,
    setNewDeviceName,
}) => {
    return (
        <Dialog
            overlayClassName={'flex items-center'}
            contentClassName="!w-1/3 flex flex-col gap-6"
            isOpen={isOpen}
            closable={false}
            onClose={onClose}
        >
            <h3>Rename Device</h3>
            <p className="text-center text-[1.4rem]">
                Enter a new name for the '{deviceName}' device.
            </p>
            <Input
                value={deviceName}
                onChange={(e) => setNewDeviceName(e.target.value)}
                placeholder="Device name..."
            />
            <div className="flex w-2/3 mx-auto justify-between">
                <Button
                    onClick={onRename}
                    loading={loading}
                    variant="solid"
                    color="green"
                >
                    Rename
                </Button>
                <Button onClick={onClose} variant="default" loading={loading}>
                    Cancel
                </Button>
            </div>
        </Dialog>
    )
}

export default RenameDeviceDialog
