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
    navLink: "/asset",
    exactActive: true
  },
  {
    id: "asset-import",
    title: "menu.asset.import",
    icon: <i className="iconly-Folder"></i>,
    action: "access",
    resource: "asset",
    navLink: "/asset/import",
    exactActive: true
  },
  {
    id: "asset-qr-code-generator",
    title: "menu.asset.code_generator",
    icon: <i className="iconly-Folder"></i>,
    action: "access",
    resource: "asset",
    navLink: "/asset/qr-code-generator",
    exactActive: true
  }
]

export default assetMenu
