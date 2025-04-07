import { NFTStorage, File } from 'nft.storage'

interface NFTMetadata {
    name: string
    image: File
    attributes: Array<{
        trait_type: string
        value: string
    }>
}

export const uploadNFTToIPFS = async (
    metadata: NFTMetadata,
    nftStorageApiKey: string
): Promise<string> => {
    const client = new NFTStorage({
        token: nftStorageApiKey,
    })

    console.log('nftStorageApiKey:', nftStorageApiKey)

    try {
        const { name, image, attributes } = metadata

        // Store the NFT data and get back the IPFS URL
        const nft = await client.store({
            name,
            description: `Digital Twin NFT for IoT Device: ${name}`,
            image,
            attributes,
        })

        return nft.url
    } catch (error) {
        console.error('Error uploading to IPFS:', error)
        throw new Error('Failed to upload metadata to IPFS')
    }
}
