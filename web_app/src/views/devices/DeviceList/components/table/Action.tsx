import { Loading } from '@/components/shared'
import { Avatar, Notification, toast, Tooltip } from '@/components/ui'
import { apiGetLocalShareUsersWithDeviceId } from '@/services/DeviceApi'
import { DeviceData } from '@/utils/hooks/useGetDevices'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { useEffect, useState } from 'react'
import { FiPackage } from 'react-icons/fi'
import {
    HiFingerPrint,
    HiOutlineEye,
    HiOutlinePencil,
    HiOutlineTrash,
    HiShare,
    HiUserGroup,
} from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { DeviceListOptionsInterface } from '../DeviceTable'

export const DeviceProductColumn = ({
    row,
    dataReceived,
}: {
    row: DeviceData
    dataReceived: boolean
}) => {
    const avatar = (
        <Avatar
            imgClass="!object-contain p-1"
            className={`!w-[60px] !h-[60px] overflow-hidden border-2 shadow-lg`}
            style={{
                borderColor: dataReceived ? '#00ff00' : '#1f2937',
                transition: 'all 1s ease',
            }}
            size={60}
            shape="circle"
            src={row.image}
        >
            {!row.image && (
                <span className="text-3xl">
                    <FiPackage />
                </span>
            )}
        </Avatar>
    )

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
    setDeviceData: (value: DeviceData) => void
    setNewDeviceName: (value: string) => void
    setRenameDialog: (value: boolean) => void
    setDeleteDialog: (value: boolean) => void
    setSelectShareDialog: (value: boolean) => void
    setUnshareDeviceDialog: (value: boolean) => void
    setSharedUsersDialog: (value: boolean) => void
    sharedLoading: boolean
    options: DeviceListOptionsInterface
}

export const DeviceActionColumn: React.FC<DeviceActionColumnProps> = ({
    row,
    setDeviceData,
    setNewDeviceName,
    setRenameDialog,
    setDeleteDialog,
    setSelectShareDialog,
    setSharedUsersDialog,
    setUnshareDeviceDialog,
    sharedLoading,
    options,
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
        setSelectShareDialog(true)
    }

    const onSharedUsers = () => {
        setDeviceData(row)
        setSharedUsersDialog(true)
    }

    const onGlobalUnshareDevice = () => {
        setDeviceData(row)
        setUnshareDeviceDialog(true)
    }

    return (
        <div className="flex justify-start text-xl">
            {sharedLoading == false && options.sharedUsers && (
                <span
                    className={`cursor-pointer p-2 hover:text-yellow-500`}
                    onClick={onSharedUsers}
                >
                    <HiUserGroup />
                </span>
            )}
            {sharedLoading == true && options.sharedUsers && (
                <span className={`cursor-pointer p-2 hover:text-yellow-500`}>
                    <Loading size={20} loading={true} />
                </span>
            )}
            {options.share && (
                <span
                    className="cursor-pointer p-2 hover:text-green-500"
                    onClick={onShare}
                >
                    <Tooltip title="Global/Local Share" placement="top">
                        <HiShare />
                    </Tooltip>
                </span>
            )}
            {options.edit && (
                <span
                    className={`cursor-pointer p-2 hover:${textTheme}`}
                    onClick={onEdit}
                >
                    <Tooltip title="Rename" placement="top">
                        <HiOutlinePencil />
                    </Tooltip>
                </span>
            )}
            {options.view && (
                <span
                    className={`cursor-pointer p-2 hover:text-gray-400`}
                    onClick={onView}
                >
                    <Tooltip title="Details" placement="top">
                        <HiOutlineEye />
                    </Tooltip>
                </span>
            )}
            {options.nft && (
                <span className={`cursor-pointer p-2 hover:${textTheme}`}>
                    <Tooltip title="NFT" placement="top">
                        <HiFingerPrint />
                    </Tooltip>
                </span>
            )}
            {options.delete && (
                <span
                    className="cursor-pointer p-2 hover:text-red-500"
                    onClick={onDelete}
                >
                    <Tooltip title="Delete" placement="top">
                        <HiOutlineTrash />
                    </Tooltip>
                </span>
            )}
            {options.unshare && (
                <span
                    className="relative cursor-pointer p-2 hover:text-white"
                    onClick={onGlobalUnshareDevice}
                >
                    <HiShare />
                    <p className="absolute text-red-500 text-[1.4rem] top-[-6px] left-[7px]">
                        __
                    </p>
                </span>
            )}
        </div>
    )
}
