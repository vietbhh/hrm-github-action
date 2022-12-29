import { useFormatMessage } from "@apps/utility/common"

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
    navLink: "/asset"
  }
]

export default assetMenu
