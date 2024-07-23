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
    HiInformationCircle
} from 'react-icons/hi'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <HiOutlineHome />,
    download:<HiCloudDownload/>, 
    myService:<HiOutlineIdentification/>, 
    notification:<HiInformationCircle />, 
    singleMenu: <HiOutlineViewGridAdd />,
    requests: <HiQuestionMarkCircle />,
    documentDownload: <HiDocumentDownload />,
    list: <HiOutlineCollection />,
    user: <HiUser />,
    device: <HiDeviceMobile />,
    collapseMenu: <HiOutlineTemplate />,
    groupSingleMenu: <HiOutlineDesktopComputer />,
    groupCollapseMenu: <HiOutlineColorSwatch />,
}

export default navigationIcon
