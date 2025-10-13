import { Dialog, Button, Input } from '@/components/ui'
import { DeviceData } from '@/utils/hooks/useGetDevices'
import { useState } from 'react'

interface SelectShareDeviceDialogProps {
    setGlobalShareDialog: (value: boolean) => void
    setLocalShareDialog: (value: boolean) => void
    loading: boolean
    isOpen: boolean
    onClose: () => void
    deviceData: DeviceData | null
}

const SelectShareDeviceDialog: React.FC<SelectShareDeviceDialogProps> = ({
    loading,
    isOpen,
    onClose,
    setGlobalShareDialog,
    setLocalShareDialog,
    deviceData,
}) => {
    return (
        <Dialog
            overlayClassName={'flex items-center'}
            isOpen={isOpen}
            closable={true}
            contentClassName="!w-1/3 flex flex-col gap-6"
            onClose={onClose}
        >
            <h3>Select Sharing Method</h3>
            <p className="text-left text-[1.1rem]">
                Choose the type of sharing you would like to use.
            </p>
            <div className="flex w-2/3 mx-auto justify-between">
                <Button
                    onClick={() => {
                        onClose()
                        setGlobalShareDialog(true)
                    }}
                    loading={loading}
                    disabled={deviceData?.isShared == true}
                    variant="default"
                >
                    Global Share
                </Button>
                <Button
                    onClick={() => {
                        onClose()
                        setLocalShareDialog(true)
                    }}
                    variant="default"
                    loading={loading}
                >
                    Local Share
                </Button>
            </div>
        </Dialog>
    )
}

export default SelectShareDeviceDialog
