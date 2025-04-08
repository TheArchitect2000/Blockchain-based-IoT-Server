import { apiUploadMedia } from '@/services/MediaAPI'
import { AxiosResponse } from 'axios'

interface NFTMetadata {
    name: string
    image: File
    attributes: Array<{
        trait_type: string
        value: string
    }>
}

interface UploadResponse {
    data: {
        _id: string
        fileName: string
        path: string
        url: string
        size: number
        type: string
        destination: string
        mediaType: string
        encoding: string
    }
    
}

export const uploadNFTToIPFS = async (
    metadata: NFTMetadata,
): Promise<string> => {
    try {
        const { name, image, attributes } = metadata

        // First, upload the NFT image
        const imageFormData = new FormData()
        imageFormData.append('file', image)
        imageFormData.append('path', 'NFT/images')
        
        const imageUploadResult = await apiUploadMedia<UploadResponse>('nft_image', imageFormData)
        const imageUrl = imageUploadResult?.data?.data?.url

        

        // Create metadata JSON with the uploaded image URL
        const metadataJson = {
            name,
            description: `Digital Twin NFT for IoT Device: ${name}`,
            image: imageUrl,
            attributes
        }

        // Convert metadata to Blob
        const metadataBlob = new Blob([JSON.stringify(metadataJson)], { type: 'application/json' })
        const metadataFile = new File([metadataBlob], `${name}.json`)

        // Upload metadata JSON
        const metadataFormData = new FormData()
        metadataFormData.append('file', metadataFile)
        metadataFormData.append('path', 'NFT/metadata')
        
        const metadataUploadResult = await apiUploadMedia<UploadResponse>('nft_metadata', metadataFormData)
        return metadataUploadResult?.data?.data?.url

    } catch (error) {
        console.error('Error uploading NFT:', error)
        throw new Error('Failed to upload NFT')
    }
}
