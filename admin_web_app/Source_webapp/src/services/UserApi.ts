import ApiService from './ApiService'

export async function apiGetCurUserProfile<T>() {
    return ApiService.fetchData<T>({
        url: import.meta.env.VITE_URL + 'v1/user/get-my-profile',
        method: 'get',
    })
}

export async function apiGetUserProfileByEmail<T>(userEmail: string) {
    return ApiService.fetchData<T>({
        url:
            import.meta.env.VITE_URL +
            `v1/user/get-profile-by-username/${userEmail}`,
        method: 'get',
    })
}

export async function apiGetUserProfileByUserId<T>(userId: string) {
    return ApiService.fetchData<T>({
        url: import.meta.env.VITE_URL + `v1/user/get-profile-by-id/${userId}`,
        method: 'get',
    })
}

export async function apiDeleteUserById<T>(userId: string) {
    return ApiService.fetchData<T>({
        url: import.meta.env.VITE_URL + `v1/user/delete-all-user-data?userId=${userId}`,
        method: 'delete',
    })
}

export async function apiGetAllUsers<T>() {
    return ApiService.fetchData<T>({
        url: import.meta.env.VITE_URL + 'v1/user/get-all-users',
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
