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
        w: 8,
        h: 8,
        minW: 8,
        minH: 2,
        maxW: 8,
        //maxH: 12,
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
        x: 0,
        y: 0,
        w: 8,
        h: 6,
        minW: 4,
        minH: 2,
        maxW: 8,
        //maxH: 12,
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
        y: 0,
        w: 8,
        h: 11,
        minW: 8,
        minH: 11,
        maxW: 8,
        //maxH: 12,
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
