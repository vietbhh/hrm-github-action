import BlankLayout from "@layouts/BlankLayout"
import VerticalLayout from "@src/layouts/VerticalLayout"
import ChatLayout from "./ChatLayout"
import DriveLayout from "./DriveLayout"

const defaultLayout = "vertical"
const layoutList = ["blank", "vertical", "chat", "drive"]

const layoutConfig = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  chat: <ChatLayout />,
  drive: <DriveLayout />
}

export { defaultLayout, layoutList, layoutConfig }
