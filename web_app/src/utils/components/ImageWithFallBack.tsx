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
        setIsLoaded(false) // Reset loaded state on src change
        let timerId: NodeJS.Timeout | null = null
        const img = new Image()
        img.src = src

        img.onload = () => {
            if (timerId) clearTimeout(timerId)
            setIsLoaded(true)
            setImageSrc(src)
        }

        img.onerror = () => {
            if (timerId) clearTimeout(timerId)
            setIsLoaded(true) // Keep fallback image
        }

        // Set timeout
        timerId = setTimeout(() => {
            if (!isLoaded) {
                // Check if still loading after 5s
                setIsLoaded(true) // Trigger fallback display
            }
        }, 5000) // 5 seconds timeout

        // Cleanup function
        return () => {
            if (timerId) clearTimeout(timerId)
            // Optional: Abort image loading if possible, though standard Image doesn't have abort
            img.onload = null
            img.onerror = null
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
