import { Button } from '@/components/ui'

const DownloadCSVButton = ({
    data,
    fileName,
    disabled,
}: {
    data: any[]
    fileName: string
    disabled?: boolean
}) => {
    const convertToCSV = (array: any[]) => {
        const header = Object.keys(array[0]).join(',')
        const rows = array.map((obj) => Object.values(obj).join(',')).join('\n')
        return `${header}\n${rows}`
    }

    const downloadCSV = () => {
        const csvData = convertToCSV(data)
        const blob = new Blob([csvData], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.setAttribute('hidden', '')
        a.setAttribute('href', url)
        a.setAttribute('download', `${fileName}.csv`)
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    return <Button disabled={disabled || false} onClick={downloadCSV}>Download CSV</Button>
}

export default DownloadCSVButton
