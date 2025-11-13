import type { ComponentPropsWithoutRef } from 'react'

interface FormDesriptionProps extends ComponentPropsWithoutRef<'div'> {
    title: string
    desc: string
}

const FormDesription = ({ title, desc, ...rest }: FormDesriptionProps) => {
    return (
        <div {...rest}>
            <h4>{title}</h4>
            <p>{desc}</p>
        </div>
    )
}

export default FormDesription
