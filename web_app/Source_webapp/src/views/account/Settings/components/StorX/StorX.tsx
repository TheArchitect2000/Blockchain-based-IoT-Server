import { Button, FormContainer } from '@/components/ui'
import './style.scss'
import StorXLogo from './sotrxLogo'
import {
    apiConstructUri,
    apiGetStorxCredentials,
    apiPostStorxCredentials,
} from '@/services/StorxApi'
import React, { useEffect, useState } from 'react'

export default function StorX() {
    const [credentials, setCredentials] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const accessGrant = params.get('access_grant')

        const fetchData = async () => {
            setLoading(true)
            if (accessGrant) {
                try {
                    await apiPostStorxCredentials(accessGrant)
                    const creds = await apiGetStorxCredentials()
                    setCredentials(creds)
                } catch (e) {
                    setCredentials(null)
                }
            } else {
                try {
                    const creds = await apiGetStorxCredentials()
                    setCredentials(creds)
                } catch (e) {
                    setCredentials(null)
                }
            }
            setLoading(false)
        }
        fetchData()
    }, [])

    const handleLogin = async () => {
        try {
            const res = (await apiConstructUri()) as any

            if (res.data?.data.uri) {
                window.location.href = res.data.data.uri
            }
        } catch (error) {
            console.error(error)
        }
    }

    if (loading) return <div>Loading...</div>

    if (credentials?.data?.data) {
        return (
            <div>
                <h2>Storx Connected Successfully</h2>
            </div>
        )
    }

    return (
        <FormContainer>
            <div className="flex items-center gap-4">
                <h5>StorX Authentication</h5>
                <StorXLogo />
            </div>
            <div className="mt-4 ltr:text-right">
                <Button
                    variant="solid"
                    size="sm"
                    className="w-fit ms-auto"
                    onClick={handleLogin}
                >
                    Login to StorX
                </Button>
            </div>
        </FormContainer>
    )
}
