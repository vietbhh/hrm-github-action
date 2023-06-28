import BlankLayout from "@layouts/BlankLayout"

import VerticalLayout from "./VerticalLayout/VerticalLayout"
import ChatLayout from "./ChatLayout/ChatLayout"
import DriveLayout from "./DriveLayout/DriveLayout"
import SeparateSidebar from "./SeparateSidebarLayout/SeparateSidebarLayout"
import EmptyLayout from "./EmptyLayout/EmptyLayout"
import AssetLayout from "./AssetLayout/AssetLayout"

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
