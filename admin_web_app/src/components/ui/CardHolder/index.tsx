import './style.scss'
import { PropsWithChildren } from 'react'

export default function CardHolder({ children }: PropsWithChildren) {
    return <section className="service-card-holder">{children}</section>
}
