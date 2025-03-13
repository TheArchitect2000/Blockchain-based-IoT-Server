import SelectDeviceForNFT from './SelectDeviceForNFT'
import FDSToken from './FDSToken'

export default function DigitalTwin() {
    return (
        <main className="flex flex-col gap-4">
            <SelectDeviceForNFT />

            <span className="w-full border-t border-gray-600 my-3"></span>
            <FDSToken />
        </main>
    )
}
