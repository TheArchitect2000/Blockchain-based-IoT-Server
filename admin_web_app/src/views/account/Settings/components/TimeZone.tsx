export function convertToTimeZone(
    date: Date | string,
    timeZone: string
): string {
    // Convert the input to a Date object if it's a string
    if (!(date instanceof Date)) {
        date = new Date(date)
    }

    // Use Intl.DateTimeFormat to format the date in the specified time zone
    const options: Intl.DateTimeFormatOptions = {
        timeZone: timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }

    const formatter = new Intl.DateTimeFormat([], options)
    const parts = formatter.formatToParts(date)

    // Extract the formatted parts and build the formatted date string
    const formattedDate = parts
        .map(({ type, value }) => {
            switch (type) {
                case 'year':
                case 'month':
                case 'day':
                case 'hour':
                case 'minute':
                case 'second':
                    return value
                case 'literal':
                    return value
                default:
                    return ''
            }
        })
        .join('')

    return formattedDate
}
