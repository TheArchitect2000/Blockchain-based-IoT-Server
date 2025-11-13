import { apiGetMyProfile } from '@/services/UserApi'
import { useQuery } from '@tanstack/react-query'

// Define the main response type
type ApiResponse = {
    statusCode: number
    success: boolean
    date: string
    message: string
    data: UserData
}

// Define the type for the user data
export type UserData = {
    _id: string
    firstName: string
    lastName: string
    mobile: string
    email: string
    walletAddress: string
    roles: UserRole[]
    info: any // 'null' or any other type can be specified if more info is known
    activationStatus: string
    activationStatusChangeReason: string | null
    activationStatusChangedBy: string | null
    activationStatusChangeDate: string | null
    verificationStatus: string
    verificationStatusChangeReason: string | null
    verificationStatusChangedBy: string | null
    verificationStatusChangeDate: string | null
    insertedBy: string | null
    insertDate: string
    isDeletable: boolean
    isDeleted: boolean
    deletedBy: string | null
    deleteDate: string | null
    deletionReason: string | null
    updatedBy: string
    updateDate: string
}

// Define the type for user roles
type UserRole = {
    description: string | null
    activationStatusChangeReason: string | null
    activationStatusChangedBy: string | null
    activationStatusChangeDate: string | null
    insertedBy: string | null
    deletedBy: string | null
    deleteDate: string | null
    deletionReason: string | null
    updatedBy: string | null
    _id: string
    department: string
    name: string
    label: string
    permissions: RolePermission[]
    activationStatus: string
    insertDate: string
    deletable: boolean
    isDeleted: boolean
    updateDate: string
    __v: number
}

// Define the type for permissions in roles
type RolePermission = {
    description: string | null
    routes: string[] // Assuming 'routes' are array of strings; adjust if different
    _id: string
    name: string
    module: string
    label: string
}

export function useGetCurUserProfile() {
    const { data: curUser, status } = useQuery({
        queryKey: ['curUser'],
        queryFn: apiGetMyProfile<ApiResponse>,
    })

    return { curUser, status }
}
