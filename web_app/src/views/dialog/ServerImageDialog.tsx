import { Avatar, Dialog } from '@/components/ui'

interface ServerImageDialogProps {
    state: boolean
    onClose: (select: boolean) => void
    setImageSrc: (url: string) => void
    closable?: boolean
}

export default function ServerImageDialog({
    state,
    onClose,
    closable = true,
    setImageSrc,
}: ServerImageDialogProps) {
    const imageIds = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ]

    return (
        <Dialog
            contentClassName="w-2/3 h-1/3 flex flex-col gap-6"
            isOpen={state}
            onClose={() => onClose(false)}
            closable={closable}
        >
            <h4>Server Images</h4>
            <section className="flex flex-wrap gap-6">
                {imageIds.map((id, index) => {
                    const imgUrl = `${
                        import.meta.env.VITE_URL
                    }uploads/avatars/${id}.png`

                    function serverImageHandle() {
                        setImageSrc(imgUrl)
                        onClose(true)
                    }
                    
                    return (
                        <Avatar
                            onClick={serverImageHandle}
                            className="!w-[100px] !h-[100px] overflow-hidden cursor-pointer hover:border-4 border-sky-500"
                            alt="icon image"
                            shape="circle"
                            icon={
                                <img
                                    className="!w-[100px] !h-[100px] object-contain"
                                    key={index}
                                    src={imgUrl}
                                />
                            }
                        />
                    )
                })}
            </section>
        </Dialog>
    )
}
