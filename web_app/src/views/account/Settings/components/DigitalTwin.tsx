import SelectDeviceForNFT from './SelectDeviceForNFT'
import FDSToken from './FDSToken'
import UserNFTAssets from './UserNFTAssets'

export default function DigitalTwin() {
    return (
        <main className="flex flex-col gap-4">
            
            <UserNFTAssets />

            <span className="w-full border-t border-gray-600 my-3"></span>
            <SelectDeviceForNFT />

            <span className="w-full border-t border-gray-600 my-3"></span>
            <FDSToken />
        </main>
    )
}
