import BlankLayout from "@layouts/BlankLayout"
import VerticalLayout from "./VerticalLayout/VerticalLayout"
import ChatLayout from "./ChatLayout/ChatLayout"
import DriveLayout from "./DriveLayout/DriveLayout"
import SeparateSidebar from "./SeparateSidebarLayout/SeparateSidebarLayout"
import CalendarLayout from "./CalendarLayout/CalendarLayout"
import SettingLayout from "./SettingLayout/SettingLayout"
import EmptyLayout from "./EmptyLayout/EmptyLayout"

const defaultLayout = "vertical"
const layoutList = ["blank", "vertical", "chat", "drive", "separateSidebar", "calendar", "empty", "setting"]

const layoutConfig = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  chat: <ChatLayout />,
  drive: <DriveLayout />,
  separateSidebar: <SeparateSidebar />,
  calendar: <CalendarLayout />,
  empty: <EmptyLayout />,
  setting: <SettingLayout />
}

export { defaultLayout, layoutList, layoutConfig }
