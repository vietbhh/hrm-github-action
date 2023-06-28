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
    resource: "asset_lists",
    navLink: "/asset/list"
  },
  {
    id: "asset-information",
    title: "menu.asset.information",
    icon: <i className="iconly-Search icli"></i>,
    action: "access",
    resource: "asset_lists",
    navLink: "/asset/information"
  },
  {
    id: "asset-code-generator",
    title: "menu.asset.qrCodeGenerator",
    icon: <i className="iconly-Scan icli"></i>,
    action: "accessBarcodeGenerator",
    resource: "asset_lists",
    navLink: "/asset/qr-code-generator"
  },
  {
    id: "asset-inventories",
    title: "menu.asset.inventories",
    icon: <i className="iconly-Tick-Square icli"></i>,
    action: "accessAssetInventory",
    resource: "asset_lists",
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
        action: "manage",
        resource: "asset_groups",
        icon: <Icon.Circle size={6} />,
        navLink: "/asset/groups"
      },
      {
        id: "asset-types",
        title: "menu.asset.assetTypes",
        type: "item",
        action: "manage",
        resource: "asset_types",
        icon: <Icon.Circle size={6} />,
        navLink: "/asset/types"
      },
      {
        id: "asset-brands",
        title: "menu.asset.asset_brand",
        type: "item",
        action: "manage",
        resource: "asset_brands",
        icon: <Icon.Circle size={6} />,
        navLink: "/asset/brands"
      },
      {
        id: "asset-print-hand-over",
        title: "menu.asset.asset_print_hand_over",
        type: "item",
        action: "access",
        resource: "asset_lists",
        icon: <Icon.Circle size={6} />,
        navLink: "/asset/print-hand-over"
      }
    ]
  }
]

export default assetMenu
