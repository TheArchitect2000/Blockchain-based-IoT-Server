import {
    HiOutlineColorSwatch,
    HiOutlineDesktopComputer,
    HiOutlineTemplate,
    HiOutlineViewGridAdd,
    HiOutlineHome,
    HiCloudDownload ,
    HiDocumentDownload,
    HiOutlineCollection,
    HiOutlineIdentification,
    HiUser,
    HiDeviceMobile,
    HiQuestionMarkCircle,
    HiDocumentText,
    HiInformationCircle,
    HiShieldCheck,
    HiChip,
    HiAdjustments,
    HiUsers,
    HiCurrencyDollar
} from 'react-icons/hi'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <HiOutlineHome />,
    download:<HiCloudDownload/>, 
    account:<HiCurrencyDollar/>, 
    myService:<HiOutlineIdentification/>, 
    admins:<HiUsers />, 
    notification:<HiInformationCircle />, 
    singleMenu: <HiOutlineViewGridAdd />,
    requests: <HiQuestionMarkCircle />,
    documentDownload: <HiDocumentDownload />,
    list: <HiOutlineCollection />,
    user: <HiUser />,
    device: <HiDeviceMobile />,
    logs: <HiDocumentText />,
    collapseMenu: <HiOutlineTemplate />,
    groupSingleMenu: <HiOutlineDesktopComputer />,
    groupCollapseMenu: <HiOutlineColorSwatch />,
}

export default navigationIcon
