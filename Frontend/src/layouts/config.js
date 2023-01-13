import BlankLayout from "@layouts/BlankLayout"
import VerticalLayout from "@src/layouts/VerticalLayout"
import ChatLayout from "./ChatLayout"
import AssetLayout from "@src/layouts/asset/AssetLayout"
import DriveLayout from "./DriveLayout"
import SeparateSidebar from "./separateSidebar/index"

const defaultLayout = "vertical"
const layoutList = ["blank", "vertical", "chat", "drive", "separateSidebar","asset"]


const layoutConfig = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  chat: <ChatLayout />,
  asset: <AssetLayout />,
  drive: <DriveLayout />,
  separateSidebar: <SeparateSidebar />
}

export { defaultLayout, layoutList, layoutConfig }
