import ApiService from './ApiService'

export async function apiGetCurUserProfile<T>() {
    return ApiService.fetchData<T>({
        url: import.meta.env.VITE_URL + 'v1/user/get-my-profile',
        method: 'get',
    })
}

export async function apiEditUserProfile<T>(
    userId: string,
    userProfileData: any
) {
    return ApiService.fetchData<T>({
        url: `${import.meta.env.VITE_URL}v1/user/edit-user-by-user/${userId}`,
        method: 'patch',
        data: userProfileData,
    })
}

export async function apiChangePasswordByEmail<T>(
    userEmail: string,
    newPassword: string
) {
    return ApiService.fetchData<T>({
        url: `${
            import.meta.env.VITE_URL
        }v1/user/change-password-and-activate-account`,
        method: 'post',
        data: {
            email: userEmail,
            newPassword: newPassword,
        },
    })
}

export async function apiRequestVerifyEmail<T>(email: string) {
    return ApiService.fetchData<T>({
        url: `${
            import.meta.env.VITE_URL
        }v1/user/request-otp-code-for-verify-email`,
        method: 'post',
        data: {
            email: email,
        },
    })
}

export async function apiGetUserProfileByUserId<T>(userId: string) {
    return ApiService.fetchData<T>({
        url: import.meta.env.VITE_URL + `v1/user/get-profile-by-id/${userId}`,
        method: 'get',
    })
}

export async function apiGetNodeTheme<T>() {
    return ApiService.fetchData<T>({
        url: import.meta.env.VITE_URL + `v1/theme`,
        method: 'get',
    })
}
