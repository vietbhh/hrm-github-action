import BlankLayout from "@layouts/BlankLayout"
import VerticalLayout from "@src/layouts/VerticalLayout"
import ChatLayout from "./ChatLayout"

const defaultLayout = "vertical"
const layoutList = ["blank", "vertical", "chat"]

const layoutConfig = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  chat: <ChatLayout />
}

export { defaultLayout, layoutList, layoutConfig }
