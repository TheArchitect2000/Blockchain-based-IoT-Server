import { Loading } from '@/components/shared'
import { Avatar, Notification, toast } from '@/components/ui'
import { apiGetLocalShareUsersWithDeviceId } from '@/services/DeviceApi'
import { DeviceData } from '@/utils/hooks/useGetDevices'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { useEffect, useState } from 'react'
import { FiPackage } from 'react-icons/fi'
import {
    HiOutlineEye,
    HiOutlinePencil,
    HiOutlineTrash,
    HiShare,
    HiUserGroup,
} from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'

export const DeviceProductColumn = ({ row }: { row: DeviceData }) => {
    const avatar = <Avatar icon={<FiPackage />} />

    return (
        <div className="flex items-center">
            {avatar}
            <span className={`ml-2 rtl:mr-2 font-semibold`}>
                {row.deviceName}
            </span>
        </div>
    )
}

interface DeviceActionColumnProps {
    row: DeviceData
    sharedDevice?: Array<DeviceData>
    setDeviceData: (value: DeviceData) => void
    setNewDeviceName: (value: string) => void
    setRenameDialog: (value: boolean) => void
    setDeleteDialog: (value: boolean) => void
    setShareDialog: (value: boolean) => void
    setSharedUsersDialog: (value: boolean) => void
    sharedLoading: boolean
    isShared: boolean
}

export const DeviceActionColumn: React.FC<DeviceActionColumnProps> = ({
    row,
    setDeviceData,
    setNewDeviceName,
    setRenameDialog,
    setDeleteDialog,
    setShareDialog,
    setSharedUsersDialog,
    sharedDevice,
    sharedLoading,
    isShared,
}) => {
    const { textTheme } = useThemeClass()
    const navigate = useNavigate()

    const onEdit = () => {
        setDeviceData(row)
        setNewDeviceName(row?.deviceName || '')
        setRenameDialog(true)
    }

    const onView = () => {
        navigate(`/devices/details/${row._id}`)
    }

    const onDelete = () => {
        setDeviceData(row)
        setDeleteDialog(true)
    }

    const onShare = () => {
        setDeviceData(row)
        setShareDialog(true)
    }

    const onSharedUsers = () => {
        setDeviceData(row)
        setSharedUsersDialog(true)
    }

    return (
        <div className="flex justify-end text-lg">
            {sharedLoading == false && isShared == true && !sharedDevice && (
                <span
                    className={`cursor-pointer p-2 hover:text-yellow-500`}
                    onClick={onSharedUsers}
                >
                    <HiUserGroup />
                </span>
            )}
            {sharedLoading == true && !sharedDevice && (
                <span className={`cursor-pointer p-2 hover:text-yellow-500`}>
                    <Loading size={20} loading={true} />
                </span>
            )}
            {!sharedDevice && (
                <span
                    className="cursor-pointer p-2 hover:text-green-500"
                    onClick={onShare}
                >
                    <HiShare />
                </span>
            )}
            {!sharedDevice && (
                <span
                    className={`cursor-pointer p-2 hover:${textTheme}`}
                    onClick={onEdit}
                >
                    <HiOutlinePencil />
                </span>
            )}
            <span
                className={`cursor-pointer p-2 hover:text-white`}
                onClick={onView}
            >
                <HiOutlineEye />
            </span>
            {!sharedDevice && (
                <span
                    className="cursor-pointer p-2 hover:text-red-500"
                    onClick={onDelete}
                >
                    <HiOutlineTrash />
                </span>
            )}
        </div>
    )
}
