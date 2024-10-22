import { Dialog, Button } from '@/components/ui'

interface DeleteDeviceDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
    deviceName: string;
}

const DeleteDeviceDialog: React.FC<DeleteDeviceDialogProps> = ({
    isOpen,
    onClose,
    onDelete,
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
            <h3 className="mb-8">Delete Device</h3>
            <p className="text-left text-[1.4rem] mb-8">
                Are you sure you want to delete the "{deviceName}" device?
                <p className="text-red-400 text-left mt-2 text-[0.9rem]">
                    *This action cannot be undone. You will need to re-add the device using the mobile app.
                </p>
            </p>

            <div className="flex w-2/3 mx-auto justify-between">
                <Button onClick={onDelete} variant="solid" color="red">
                    Delete
                </Button>
                <Button onClick={onClose} variant="default">
                    Cancel
                </Button>
            </div>
        </Dialog>
    )
}

export default DeleteDeviceDialog
