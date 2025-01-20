// src/components/GoogleLoginButton.tsx
import React from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'

const GoogleLoginButton: React.FC = () => {
    const handleSuccess = async (credentialResponse: any) => {
        console.log('Google Login Success:', credentialResponse)

        // Send the credential to the backend for verification
        const response = await fetch(
            'https://developer.fidesinnova.io/app/authentication/google/token',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    credential: credentialResponse.credential,
                }),
            }
        )

        const data = await response.json()
        console.log('Backend Response:', data)
        if (data.jwt) {
            // Save the JWT in localStorage or a cookie
            localStorage.setItem('token', data.jwt)
        }
    }

    const handleError = () => {
        console.error('Google Login Failed')
    }

    return (
        <GoogleOAuthProvider clientId="990952057079-r35cambumvgrl8pqcvegi676gplmilq2.apps.googleusercontent.com">
            <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
        </GoogleOAuthProvider>
    )
}

export default GoogleLoginButton
