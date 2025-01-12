import classNames from 'classnames'
import { HEADER_HEIGHT_CLASS } from '@/constants/theme.constant'
import { useEffect, useState, type ReactNode } from 'react'
import type { CommonProps } from '@/@types/common'

import {
    Button,
    Dialog,
    Dropdown,
    FormContainer,
    Input,
    Notification,
    toast,
    Upload,
} from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import { useConfig } from '../ui/ConfigProvider'
import {
    apiValidateRemixIDE,
    apiValidateZkpCommitment,
} from '@/services/UserApi'
import { PasswordInput } from '../shared'
import './style.css'
import { useRoleStore } from '@/store/user/userRoleStore'

interface HeaderProps extends CommonProps {
    headerStart?: ReactNode
    headerEnd?: ReactNode
    headerMiddle?: ReactNode
    container?: boolean
}

const Header = (props: HeaderProps) => {
    const { headerStart, headerEnd, headerMiddle, className, container } = props

    const navigate = useNavigate()

    const onCreateNewService = () => {
        navigate(`/services/new`)
    }

    const { themeBackground } = useConfig()

    function dropDownSelectHandler(eventKey: string) {
        if (eventKey == 'Smart Contract Console') {
            navigate(`/remix`)
        } else if (eventKey == 'ZKP Commitment Submiter') {
            navigate(`/commitment`)
        } else if (eventKey == 'ZKP Proof Submiter') {
            navigate(`/proof-submiter`)
        } else if (eventKey == 'ZKP Commitment Generator') {
            window.open('https://github.com/FidesInnova/zkiot', '_blank')
        }
    }

    return (
        <header
            className={classNames(
                'header',
                `dark:bg-${themeBackground}`,
                className
            )}
        >
            <div
                className={classNames(
                    'header-wrapper',
                    HEADER_HEIGHT_CLASS,
                    container && 'container mx-auto'
                )}
            >
                <div className="header-action header-action-start">
                    {headerStart}
                </div>

                {headerMiddle && (
                    <div className="header-action header-action-middle">
                        {headerMiddle}
                    </div>
                )}

                <div className="flex flex-row">
                    <div className="gap-4 mt-1 justify-end hidden sm:flex">
                        <Dropdown
                            onSelect={dropDownSelectHandler}
                            renderTitle={
                                <Button variant="solid">
                                    IoT Developer Console
                                </Button>
                            }
                            placement="bottom-center"
                            menuClass="w-full flex flex-col gap-2 mt-1"
                        >
                            <Dropdown.Item
                                className="flex justify-center advanced-drop-down-items"
                                eventKey={'Smart Contract Console'}
                            >
                                Smart Contract Console
                            </Dropdown.Item>
                            <Dropdown.Item
                                className="flex justify-center advanced-drop-down-items"
                                eventKey={'ZKP Commitment Generator'}
                            >
                                ZKP Commitment Generator
                            </Dropdown.Item>
                            <Dropdown.Item
                                className="flex justify-center advanced-drop-down-items"
                                eventKey={'ZKP Commitment Submiter'}
                            >
                                ZKP Commitment Submiter
                            </Dropdown.Item>
                            <Dropdown.Item
                                className="flex justify-center advanced-drop-down-items"
                                eventKey={'ZKP Proof Submiter'}
                            >
                                ZKP Proof Submiter
                            </Dropdown.Item>
                        </Dropdown>
                        <Button onClick={onCreateNewService} variant="solid">
                            Create New Service
                        </Button>{' '}
                    </div>
                    <div className="header-action header-action-end">
                        {headerEnd}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
