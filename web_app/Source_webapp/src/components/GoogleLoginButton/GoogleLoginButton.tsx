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
import axios from 'axios'

const GoogleLoginButton: React.FC = () => {
    const { signIn } = useAuth()

    const handleSuccess = async (credentialResponse: any) => {
        console.log('Google Login Success:', credentialResponse)
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

    const handleError = () => {
        console.error('Google Login Failed')
    }

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log(tokenResponse)
            // fetching userinfo can be done on the client or the server
            const userInfo = await axios
                .get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                })
                .then((res) => res.data)

            console.log(userInfo)
        },
        // flow: 'implicit', // implicit is the default
    })

    return (
        <>
            {/* <GoogleButton style={{ width: '100%' }} onClick={() => login()} /> */}
            <GoogleLogin
                type="standard"
                theme="outline"
                size="large"
                width={'100% !important'}
                containerProps={{
                    style: {
                        maxWidth: '2000px',
                        width: '100% !important',
                    },
                }}
                onSuccess={handleSuccess}
            />
        </>
    )
}

export default GoogleLoginButton
