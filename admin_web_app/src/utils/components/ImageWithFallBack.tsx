import { Loading } from '@/components/shared'
import React, { useState, useEffect } from 'react'

interface ImageWithFallbackProps {
    src: string
    alt: string
    className?: string
}

const ImageWithFallBack: React.FC<ImageWithFallbackProps> = ({
    src,
    alt,
    className,
}) => {
    const [imageSrc, setImageSrc] = useState<string>('/img/others/img-1.jpg') // Fallback image
    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    useEffect(() => {
        const img = new Image()
        img.src = src
        img.onload = () => {
            setIsLoaded(true)
            setImageSrc(src)
        }
    }, [src])

    return (
        <figure className="relative">
            <img
                className={className || ''}
                src={imageSrc}
                alt={alt}
                style={{ opacity: isLoaded ? 1 : 0.5 }} // Optional: style to indicate loading state
            />
            <Loading
                loading={!isLoaded}
                spinnerClass="text-[cyan]"
                className="absolute inset-0 m-auto w-1/2 h-1/2 flex justify-center items-center"
            />
        </figure>
    )
}

export default ImageWithFallBack
