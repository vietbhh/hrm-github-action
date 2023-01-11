import BlankLayout from "@layouts/BlankLayout"
import VerticalLayout from "@src/layouts/VerticalLayout"
import ChatLayout from "./ChatLayout"
import DriveLayout from "./DriveLayout"
import HomePageLayout from "./homepage/index"

const defaultLayout = "vertical"
const layoutList = ["blank", "vertical", "chat", "drive", "homepage"]

const layoutConfig = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  chat: <ChatLayout />,
  drive: <DriveLayout />,
  homepage: <HomePageLayout />
}

export { defaultLayout, layoutList, layoutConfig }
