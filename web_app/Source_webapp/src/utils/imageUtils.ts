// Remove the node-fetch import since we'll use browser's native File class

export const addTextToImage = async (
    imageUrl: string,
    text: string
): Promise<File> => {
    // Create an image object from the URL
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.src = imageUrl

    return new Promise<File>((resolve, reject) => {
        image.onload = () => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            if (!ctx) {
                reject(new Error('Unable to get canvas context'))
                return
            }

            // Set canvas size to match the image
            canvas.width = image.width
            canvas.height = image.height

            // Draw the image on the canvas
            ctx.drawImage(image, 0, 0)

            // Set up text properties
            const fontSize = Math.min(image.width, image.height) * 0.11
            ctx.font = `${fontSize}px Arial`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'

            // Calculate text dimensions
            const textMetrics = ctx.measureText(text)
            const textWidth = textMetrics.width
            const textHeight = fontSize

            // Add black background only behind text
            const textX = canvas.width / 2
            const textY = canvas.height / 2
            const padding = 10
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
            ctx.fillRect(
                textX - textWidth / 2 - padding,
                textY - textHeight / 2 - padding,
                textWidth + padding * 2,
                textHeight + padding * 2
            )

            // Draw the text in the center of the image
            ctx.fillStyle = 'white'
            ctx.fillText(text, textX, textY)

            // Convert the canvas content to a Blob and create a File object
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(
                            new File([blob], 'device-image.png', {
                                type: 'image/png',
                            })
                        )
                    } else {
                        reject(new Error('Unable to create image Blob'))
                    }
                },
                'image/png',
                1
            )
        }

        image.onerror = () => {
            reject(new Error('Failed to load image'))
        }
    })
}
