import { MouseEvent } from 'react'
import Dialog from '../Dialog'
import Button from '../../Button'

interface SureDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    onCancel?: () => void
    title?: string
    message?: string
}

const SureDialog = ({
    isOpen,
    onClose,
    onConfirm,
    onCancel,
    title = 'Are you sure?',
    message = 'Do you really want to proceed?',
}: SureDialogProps) => {
    return (
        <Dialog
            closable={false}
            isOpen={isOpen}
            onClose={onClose}
            contentClassName="!w-1/3 p-6"
        >
            <div className="flex flex-col gap-8">
                <h3 className="font-semibold">{title}</h3>
                <p className="text-center text-[1.2rem]">{message}</p>
                <div className="flex justify-center gap-12">
                    <Button
                        variant="solid"
                        color="red-500"
                        onClick={() => {
                            if (onConfirm) {
                                onConfirm()
                            }
                            onClose()
                        }}
                    >
                        Confirm
                    </Button>
                    <Button
                        variant="default"
                        onClick={() => {
                            if (onCancel) {
                                onCancel()
                            }
                            onClose()
                        }}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default SureDialog
