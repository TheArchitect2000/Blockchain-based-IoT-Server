import { UserData } from '../hooks/useGetDevices'

type OutputObject = {
    firstName: string | null
    lastName: string | null
    email: string
    address_line_1: string
    address_line_2: string
    country: string
    city: string
    state: string
    zipCode: string
    telephone: string | null
}

export function transformCsvData(inputArray: UserData[]): OutputObject[] {
    return inputArray.map((obj) => {
        // Construct telephone string from tel object
        const telephone = obj.tel
            ? `${obj.tel?.countryCode?.value || ''} ${obj.tel?.phoneNumber || ''}`
            : null

        // Destructure necessary fields and rename address lines
        const {
            firstName,
            lastName,
            email,
            address: { line_1, line_2, country, city, state, zipCode },
        } = obj

        // Return the transformed object
        const result: OutputObject = {
            firstName,
            lastName,
            email,
            address_line_1: line_1,
            address_line_2: line_2,
            country,
            city,
            state,
            zipCode,
            telephone,
        }

        // Log each result
        console.log(result)

        return result
    })
}
