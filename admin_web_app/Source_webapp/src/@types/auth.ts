export type SignInCredential = {
    email: string
    password: string
}

export type SignInResponse = {
    statusCode: number
    success: boolean
    date: string
    message: string
    data: UserData
}

type UserData = {
    _id: string
    firstName: string
    lastName: string
    mobile: string
    email: string
    walletAddress: string
    roles: UserRole[]
    info: Record<string, unknown> // Assuming 'info' is a flexible object.
    activationStatus: string
    activationStatusChangeReason?: string
    activationStatusChangedBy?: string
    activationStatusChangeDate?: string
    verificationStatus: string
    verificationStatusChangeReason?: string
    verificationStatusChangedBy?: string
    verificationStatusChangeDate?: string
    insertedBy?: string
    insertDate: string
    updatedBy?: string
    updateDate: string
    isDeletable: boolean
    isDeleted: boolean
    deletedBy?: string
    deleteDate?: string
    deletionReason?: string
    tokens: UserTokens
}

type UserRole = {
    description?: string
    activationStatusChangeReason?: string
    activationStatusChangedBy?: string
    activationStatusChangeDate?: string
    insertedBy?: string
    deletedBy?: string
    deleteDate?: string
    deletionReason?: string
    updatedBy?: string
    _id: string
    department: string
    name: string
    label: string
    permissions: Permission[]
    activationStatus: string
    insertDate: string
    deletable: boolean
    isDeleted: boolean
    updateDate: string
    __v: number
}

type Permission = {
    description?: string
    routes: string[]
    activationStatusChangeReason?: string
    activationStatusChangedBy?: string
    activationStatusChangeDate?: string
    verificationStatusChangeReason?: string
    verificationStatusChangedBy?: string
    verificationStatusChangeDate?: string
    insertedBy?: string
    deletedBy?: string
    deleteDate?: string
    deletionReason?: string
    updatedBy?: string
    _id: string
    name: string
    module: string
    label: string
    activationStatus: string
    verificationStatus: string
    insertDate: string
    deletable: boolean
    isDeleted: boolean
    updateDate: string
    __v: number
}

type UserTokens = {
    accessToken: string
    refreshToken: string
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    email: string
    password: string
}

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    password: string
}