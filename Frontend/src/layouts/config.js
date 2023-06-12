import BlankLayout from "@layouts/BlankLayout"
import VerticalLayout from "@src/layouts/VerticalLayout"
import ChatLayout from "./ChatLayout"
import AssetLayout from "@src/layouts/asset/AssetLayout"
import DriveLayout from "./DriveLayout"
import SeparateSidebar from "./separateSidebar/index"
import EmptyLayout from "./emptyLayout/EmptyLayout"

const defaultLayout = "vertical"

const layoutList = ["blank", "vertical", "chat", "drive", "separateSidebar","asset", "empty"]

const layoutConfig = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  chat: <ChatLayout />,
  asset: <AssetLayout />,
  drive: <DriveLayout />,
  separateSidebar: <SeparateSidebar />,
  empty: <EmptyLayout />
}

export { defaultLayout, layoutList, layoutConfig }
