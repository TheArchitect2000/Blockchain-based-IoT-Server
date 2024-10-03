import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism' // You can change the theme

const JsonDisplay = ({ jsonData }: { jsonData: string }) => {
    // Check if the data is a string and parse it
    const isString = typeof jsonData === 'string'
    const parsedJson = isString ? JSON.parse(jsonData) : jsonData

    const jsonString = JSON.stringify(parsedJson, null, 2) // Pretty-print the JSON

    return (
        <SyntaxHighlighter language="json" style={atomDark}>
            {jsonString}
        </SyntaxHighlighter>
    )
}

export default JsonDisplay
