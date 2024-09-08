import { cloneElement, useEffect, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Logo from '@/components/template/Logo'
import { APP_NAME } from '@/constants/app.constant'
import type { CommonProps } from '@/@types/common'
import { apiGetNodeTheme } from '@/services/UserApi'
import { nodeThemeApi } from '@/configs/theme.config'

interface SideProps extends CommonProps {
    content?: React.ReactNode
}

//TODO:
const Side = ({ children, content, ...rest }: SideProps) => {
    const [nodeData, setNodeData] = useState<nodeThemeApi>()
    
    useEffect(() => {
        async function fetchData() {
            const res = (await apiGetNodeTheme()) as any
            setNodeData(res?.data?.data as nodeThemeApi)
        }
        fetchData()
    }, [])

    return (
        <div className="grid lg:grid-cols-3 h-full">
            <div
                className="bg-no-repeat relative bg-cover py-6 px-16 flex-col justify-center items-center hidden lg:flex"
                style={{
                    background: `linear-gradient(to bottom, #${nodeData?.button}, #${nodeData?.background})`,
                }}
            >
                {nodeData && (
                    <img
                        src={nodeData.logo}
                        className="aspect-auto w-1/2"
                        alt="logo"
                    />
                )}

                <div className="flex flex-col items-center text-center gap-2 absolute bottom-2">
                    <img
                        src="/img/logo/logo-captcha.png"
                        className="aspect-auto w-5/12 max-w-[100px]"
                        alt="logo"
                    />
                    <p>{import.meta.env.VITE_NODE_NAME} Powered by FidesInnova technology</p>
                </div>

                {/* <Logo mode="dark" /> */}
                {/* <div>
                    <div className="mb-6 flex items-center gap-4">
                        <Avatar
                            className="border-2 border-white"
                            shape="circle"
                            src="/img/avatars/thumb-10.jpg"
                        />
                        <div className="text-white">
                            <div className="font-semibold text-base">
                                Brittany Hale
                            </div>
                            <span className="opacity-80">CTO, Onward</span>
                        </div>
                    </div>
                    <p className="text-lg text-white opacity-80">
                        Elstar comes with a complete set of UI components
                        crafted with Tailwind CSS, it fulfilled most of the use
                        case to create modern and beautiful UI and application
                    </p>
                </div> */}
                {/* <span className="text-white">
                    Copyright &copy; {`${new Date().getFullYear()}`}{' '}
                    <span className="font-semibold">{`${APP_NAME}`}</span>{' '}
                </span> */}
            </div>
            <div className="col-span-2 flex flex-col justify-center items-center bg-white dark:bg-gray-800">
                <div className="xl:min-w-[450px] px-8">
                    <div className="mb-8">{content}</div>
                    {children
                        ? cloneElement(children as React.ReactElement, {
                              ...rest,
                          })
                        : null}
                </div>
            </div>
        </div>
    )
}

export default Side
