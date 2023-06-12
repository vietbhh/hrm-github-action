import BlankLayout from "@layouts/BlankLayout"
import VerticalLayout from "@src/layouts/VerticalLayout"
import ChatLayout from "./ChatLayout"
import DriveLayout from "./DriveLayout"
import SeparateSidebar from "./separateSidebar/index"
import EmptyLayout from "./emptyLayout/EmptyLayout"

const defaultLayout = "vertical"
const layoutList = ["blank", "vertical", "chat", "drive", "separateSidebar", "empty"]

const layoutConfig = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  chat: <ChatLayout />,
  drive: <DriveLayout />,
  separateSidebar: <SeparateSidebar />,
  empty: <EmptyLayout />
}

export { defaultLayout, layoutList, layoutConfig }
