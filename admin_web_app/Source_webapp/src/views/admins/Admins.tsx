import { AdaptableCard, Loading } from '@/components/shared'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCheckPage } from '../security/CheckPage'
import MakeAdmin from './components/MakeAdmin'

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
                <main className="flex flex-col gap-4">
                    <MakeAdmin />
                    {/* <h3>
                        All Admins List ( {dataCount} )
                    </h3> */}
                </main>
            )) || <Loading loading={true} />}
        </AdaptableCard>
    )
}
