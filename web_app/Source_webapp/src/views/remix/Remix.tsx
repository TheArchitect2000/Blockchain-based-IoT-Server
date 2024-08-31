import { Loading } from '@/components/shared'
import { apiValidateRemixIDE } from '@/services/UserApi'
import { setSideNavCollapse, useAppDispatch } from '@/store'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const RemixIframe: React.FC = () => {
    const [loading, setLoading] = useState(true)
    const location = useLocation()
    const navigateTo = useNavigate()
    const dispatch = useAppDispatch()

    useEffect(() => {
        async function validateData(user: string, pass: string) {
            const res = (await apiValidateRemixIDE(user, pass)) as any
            if (res.data.data) {
                setLoading(false)
            } else {
                navigateTo('/')
            }
        }

        dispatch(setSideNavCollapse(true))

        setTimeout(() => {
            window.scrollTo(0, 0)
        }, 2000)

        const params = new URLSearchParams(location.search)
        const userValue = params.get('user') || ''
        const passwordValue = params.get('pass') || ''

        validateData(userValue, passwordValue)
    }, [location.search])

    if (loading) {
        return (
            <main className="w-full h-screen flex justify-center items-center">
                <Loading loading={true} />
            </main>
        )
    }

    return (
        <iframe
            title="Remix IDE"
            src="https://remix.ethereum.org"
            style={{ width: '100%', height: '84vh', border: 'none' }}
        />
    )
}

export default RemixIframe
