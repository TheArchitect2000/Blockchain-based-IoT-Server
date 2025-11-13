import ApiService from './ApiService'
import type {
    SignInCredential,
    SignUpCredential,
    ForgotPassword,
    ResetPassword,
    SignInResponse,
    SignUpResponse,
} from '@/@types/auth'


export async function apiSignIn(data: SignInCredential) {
    const res = await ApiService.fetchData<SignInResponse>({
        url: import.meta.env.VITE_URL + 'v1/user/admin-credential',
        method: 'post',
        data,
    })

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

export async function apiAdminSignInGoogle(
    tokenId?: string | null,
    accessToken?: string | null
) {
    const res = ApiService.fetchData<SignInResponse>({
        url: import.meta.env.VITE_URL + 'authentication/google/token',
        method: 'post',
        data: {
            accessToken: accessToken,
            tokenId: tokenId,
            admin: true
        },
    })

    return res
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
