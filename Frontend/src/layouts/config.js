import BlankLayout from "@layouts/BlankLayout"
import VerticalLayout from "@src/layouts/VerticalLayout"
import ChatLayout from "./ChatLayout"
import DriveLayout from "./DriveLayout"
import SeparateSidebar from "./separateSidebar/index"

const defaultLayout = "vertical"
const layoutList = ["blank", "vertical", "chat", "drive", "separateSidebar"]

const layoutConfig = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  chat: <ChatLayout />,
  drive: <DriveLayout />,
  separateSidebar: <SeparateSidebar />
}

export { defaultLayout, layoutList, layoutConfig }
