import { toolbox } from '@/views/services/ServiceCode/components/BlocklyEditor'
import { BlocklyWorkspace } from 'react-blockly'

export default function CardBlockly({ xml }: { xml: string }) {
    return (
        <BlocklyWorkspace
            className={`h-[30rem]`} // you can use whatever classes are appropriate for your app's CSS
            toolboxConfiguration={toolbox} // this must be a JSON toolbox definition
            initialXml={xml}
            workspaceConfiguration={{
                grid: {
                    spacing: 20,
                    length: 3,
                    colour: '#ccc',
                    snap: true,
                },
                trashcan: true,
                media: `${import.meta.env.VITE_URL}uploads/`,
                readOnly: true,
            }}
        />
    )
}
