import { useFormatMessage } from "@apps/utility/common"
import * as Icon from "react-feather"
const assetMenu = [
  {
    header: useFormatMessage("layout.admin_tools"),
    header_short: useFormatMessage("layout.tools")
  },
  {
    id: "asset-list",
    title: "menu.asset.list",
    icon: <i className="iconly-Folder"></i>,
    action: "access",
    resource: "asset",
    navLink: "/asset/list"
  },
  {
    id: "asset-information",
    title: "menu.asset.information",
    icon: <i className="iconly-Search icli"></i>,
    action: "access",
    resource: "asset",
    navLink: "/asset/information"
  },
  {
    id: "asset-code-generator",
    title: "menu.asset.qrCodeGenerator",
    icon: <i className="iconly-Scan icli"></i>,
    action: "access",
    resource: "asset",
    navLink: "/asset/qr-code-generator"
  },
  {
    id: "asset-inventories",
    title: "menu.asset.inventories",
    icon: <i className="iconly-Tick-Square icli"></i>,
    action: "access",
    resource: "asset",
    navLink: "/asset/inventories"
  },
  {
    id: "asset-other",
    title: "menu.other",
    type: "dropdown",
    icon: <i className="iconly-Setting icli"></i>,
    children: [
      {
        id: "asset-groups",
        title: "menu.asset.assetGroups",
        type: "item",
        action: "access",
        resource: "asset",
        icon: <Icon.Circle size={6} />,
        navLink: "/asset-groups"
      },
      {
        id: "asset-types",
        title: "menu.asset.assetTypes",
        type: "item",
        action: "access",
        resource: "asset",
        icon: <Icon.Circle size={6} />,
        navLink: "/asset-types"
      }
    ]
  }
]

export default assetMenu
