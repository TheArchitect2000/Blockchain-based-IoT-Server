import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism' // You can change the theme
import { useEffect, useState } from 'react'
import { DoubleSidedImage } from '@/components/shared'

const JsonDisplay = ({ jsonData }: { jsonData: string }) => {
    const [parsedJson, setParsedJson] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        try {
            const parsed =
                typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData
            setParsedJson(JSON.stringify(parsed, null, 2)) // Pretty-print the JSON if valid
            setError(null) // Clear any previous errors
        } catch (e) {
            setParsedJson(null) // Clear the displayed JSON if parsing fails
            setError('Invalid JSON format')
        }
    }, [jsonData]) // Only run this effect when jsonData changes

    return (
        <>
            {error ? (
                <div className="flex flex-col gap-4 w-full h-full items-center justify-center text-[1.5rem]">
                    <DoubleSidedImage
                        className="w-3/12 max-w-[250px]"
                        src="/img/others/img-2.png"
                        darkModeSrc="/img/others/img-2-dark.png"
                        alt="No product found!"
                    />
                    {error}
                </div>
            ) : (
                parsedJson && (
                    <SyntaxHighlighter language="json" style={atomDark}>
                        {parsedJson}
                    </SyntaxHighlighter>
                )
            )}
        </>
    )
}

export default JsonDisplay
