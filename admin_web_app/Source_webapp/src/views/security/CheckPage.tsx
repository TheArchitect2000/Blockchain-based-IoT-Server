import { useEffect, useState } from 'react'
import { apiGetUserAdminRoles } from '@/services/UserApi'
import { useAppSelector } from '@/store'

export function useCheckPage(pageName: string) {
    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState<boolean>(false)

    const { email: userEmail } = useAppSelector((state) => state.auth.user)

    useEffect(() => {
        async function fetchData() {
            const res = (await apiGetUserAdminRoles(userEmail || '')) as any
            const rolesArray = res.data?.data as Array<string>
            if (rolesArray.includes(pageName) || rolesArray.includes('super')) {
                setResult(true)
            } else {
                setResult(false)
            }
            setLoading(false)
        }
        fetchData()
    }, [userEmail, pageName]) // Added dependencies to useEffect to avoid potential infinite loop

    return { loading, result }
}
