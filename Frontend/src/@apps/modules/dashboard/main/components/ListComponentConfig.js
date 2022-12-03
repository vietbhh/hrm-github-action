import { useFormatMessage } from "@apps/utility/common"
import WidgetPreview1 from "../../assets/images/WidgetPreview1.svg"
import CardAnnouncements from "./CardAnnouncements"
import CardCalendar from "./CardCalendar"
import Notepad from "./Notepad"

const BackgroundWidget = () => {
  return <img className="img" src={WidgetPreview1} />
}

export const ListComponentConfig = (props) => {
  return [
    {
      id: "upcoming_events",
      title: useFormatMessage("modules.dashboard.upcoming_events"),
      component: <CardCalendar showCalendarDescription={false} {...props} />,
      data_grid: {
        i: "upcoming_events",
        x: 0,
        y: 0,
        w: 2,
        h: 10,
        minW: 1,
        minH: 6,
        maxW: 2,
        static: false,
        isDraggable: true
      },
      background: <BackgroundWidget />,
      show: false,
      action: "login",
      resource: "app"
    },
    {
      id: "notepad",
      title: useFormatMessage("modules.dashboard.notepad.title"),
      component: <Notepad {...props} />,
      data_grid: {
        i: "notepad",
        x: 0,
        y: 14,
        w: 2,
        h: 10,
        minW: 1,
        minH: 6,
        maxW: 2,
        static: false,
        isDraggable: true
      },
      background: <BackgroundWidget />,
      show: false,
      action: "login",
      resource: "app"
    },
    {
      id: "announcement",
      title: useFormatMessage("modules.dashboard.announcement.title"),
      component: <CardAnnouncements {...props} />,
      data_grid: {
        i: "announcement",
        x: 2,
        y: 25,
        w: 1,
        h: 6,
        minW: 1,
        minH: 6,
        maxW: 2,
        static: false,
        isDraggable: true
      },
      background: <BackgroundWidget />,
      show: false,
      action: "login",
      resource: "app"
    }
  ]
}
