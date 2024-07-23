import {
    HiOutlineColorSwatch,
    HiOutlineDesktopComputer,
    HiOutlineTemplate,
    HiOutlineViewGridAdd,
    HiOutlineHome,
    HiCloudDownload ,
    HiDocumentDownload,
    HiOutlineCollection,
    HiOutlineIdentification
} from 'react-icons/hi'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <HiOutlineHome />,
    download:<HiCloudDownload/>, 
    myService:<HiOutlineIdentification/>, 
    singleMenu: <HiOutlineViewGridAdd />,
    documentDownload: <HiDocumentDownload />,
    list: <HiOutlineCollection />,
    collapseMenu: <HiOutlineTemplate />,
    groupSingleMenu: <HiOutlineDesktopComputer />,
    groupCollapseMenu: <HiOutlineColorSwatch />,
}

export default navigationIcon
