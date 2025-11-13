import { AdaptableCard, Loading } from '@/components/shared'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCheckPage } from '../security/CheckPage'
import MakeAdmin from './components/MakeAdmin'
import AdminsList from './components/AdminsList'

export default function Admins() {
    const [dataCount, setDataCount] = useState(0)
    const navigateTo = useNavigate()
    const { loading, result } = useCheckPage('super')
    if (loading == false) {
        if (result == false) {
            navigateTo('/')
        }
    }
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            {(loading == false && (
                <main className="flex flex-col gap-10">
                    <MakeAdmin />
                    <AdminsList />
                </main>
            )) || <Loading loading={true} />}
        </AdaptableCard>
    )
}
