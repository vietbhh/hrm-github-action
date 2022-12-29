import BlankLayout from "@layouts/BlankLayout"
import VerticalLayout from "@src/layouts/VerticalLayout"
import ChatLayout from "./ChatLayout"
import AssetLayout from "@src/layouts/asset/AssetLayout"

const defaultLayout = "vertical"
const layoutList = ["blank", "vertical", "chat", "asset"]

const layoutConfig = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  chat: <ChatLayout />,
  asset: <AssetLayout />
}

export { defaultLayout, layoutList, layoutConfig }
