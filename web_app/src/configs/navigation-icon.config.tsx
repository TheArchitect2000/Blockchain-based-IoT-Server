import {
    HiOutlineColorSwatch,
    HiOutlineDesktopComputer,
    HiOutlineTemplate,
    HiOutlineViewGridAdd,
    HiOutlineHome,
    HiCloudDownload,
    HiDocumentDownload,
    HiOutlineCollection,
    HiOutlineIdentification,
    HiUserGroup,
    HiGlobe,
    HiGlobeAlt,
    HiPrinter,
} from 'react-icons/hi'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <HiOutlineHome />,
    download: <HiCloudDownload />,
    myService: <HiOutlineIdentification />,
    singleMenu: <HiOutlineViewGridAdd />,
    documentDownload: <HiDocumentDownload />,
    list: <HiOutlineCollection />,
    building: <HiUserGroup />,
    collapseMenu: <HiOutlineTemplate />,
    groupSingleMenu: <HiOutlineDesktopComputer />,
    groupCollapseMenu: <HiOutlineColorSwatch />,
    explorer: <HiGlobeAlt />,
    logs: <HiPrinter />,
}

export default navigationIcon
