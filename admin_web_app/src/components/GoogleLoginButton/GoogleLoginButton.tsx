// src/components/GoogleLoginButton.tsx
import React from 'react'
import {
    GoogleOAuthProvider,
    GoogleLogin,
    useGoogleLogin,
    useGoogleOAuth,
    useGoogleOneTapLogin,
} from '@react-oauth/google'
import useAuth from '@/utils/hooks/useAuth'
import { Notification, toast } from '../ui'
import GoogleButton from 'react-google-button'

const GoogleLoginButton: React.FC = () => {
    const { signIn } = useAuth()

    const handleSuccess = async (credentialResponse: any) => {
        const response = await signIn({
            tokenId: credentialResponse.credential,
        })
        if (response?.status == 'failed') {
            toast.push(
                <Notification title={response.message} type="danger" />,
                {
                    placement: 'top-center',
                }
            )
        }
    }

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            const response = await signIn({
                accessToken: tokenResponse.access_token,
            })
            if (response?.status == 'failed') {
                toast.push(
                    <Notification title={response.message} type="danger" />,
                    {
                        placement: 'top-center',
                    }
                )
            }
        },
        // flow: 'implicit', // implicit is the default
    })

    return (
        <>
            <GoogleButton
                className="google-button"
                style={{
                    width: '100%',
                    borderRadius: '0.375rem',
                    overflow: 'hidden',
                }}
                label="Continue with Google"
                type="dark"
                onClick={() => login()}
            />
        </>
    )
}

export default GoogleLoginButton
