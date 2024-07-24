import ApiService from './ApiService'
import type {
    SignInCredential,
    SignUpCredential,
    ForgotPassword,
    ResetPassword,
    SignInResponse,
    SignUpResponse,
    CheckPassword,
} from '@/@types/auth'

export async function apiSignIn(data: SignInCredential) {
    const res = ApiService.fetchData<SignInResponse>({
        url: import.meta.env.VITE_URL + 'v1/user/credential',
        method: 'post',
        data,
    })

    console.log(res)

    return res
}

export async function apiCheckEmailExist(email: string) {
    const res = ApiService.fetchData<SignInResponse>({
        url:
            import.meta.env.VITE_URL +
            `v1/user/check-user-email-is-exists/${email}`,
        method: 'get',
    })

    console.log(res)

    return res
}

export async function apiRequestResetPassword(email: string, newPassword: string) {
    const res = ApiService.fetchData<SignInResponse>({
        url:
            import.meta.env.VITE_URL +
            `v1/user/request-otp-code-for-reset-password-by-email`,
        method: 'post',
        data: {
            email: email,
            newPassword: newPassword,
        },
    })

    console.log(res)

    return res
}

export async function apiCheckPassword(data: CheckPassword) {
    const res = ApiService.fetchData<SignInResponse>({
        url: import.meta.env.VITE_URL + 'v1/user/check-password',
        method: 'post',
        data,
    })

    console.log(res)

    return res
}

export async function apiSignUp(data: SignUpCredential) {
    return ApiService.fetchData<SignUpResponse>({
        url:
            import.meta.env.VITE_URL +
            'v1/user/request-otp-code-for-signup-by-email',
        method: 'post',
        data,
    })
}

export async function apiSignOut() {
    return ApiService.fetchData({
        url: '/sign-out',
        method: 'post',
    })
}

export async function apiForgotPassword(data: ForgotPassword) {
    return ApiService.fetchData({
        url: '/forgot-password',
        method: 'post',
        data,
    })
}

export async function apiResetPassword(data: ResetPassword) {
    return ApiService.fetchData({
        url: '/reset-password',
        method: 'post',
        data,
    })
}
