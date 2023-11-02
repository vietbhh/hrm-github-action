import WidgetPreview1 from "@apps/modules/dashboard/assets/images/WidgetPreview1.svg"
import Notepad from "@apps/modules/dashboard/main/components/Notepad"
import { useFormatMessage } from "@apps/utility/common"
import ClockInOutWidget from "@modules/Dashboard/components/details/clock/ClockInOutWidget"
import CardBirthday from "../../../@apps/modules/dashboard/main/components/CardBirthday"
import CardEvent from "../../../@apps/modules/dashboard/main/components/CardEvent"

const BackgroundWidget = () => {
  return <img className="img" src={WidgetPreview1} />
}

export const ListSidebarWidget = (props) => {
  return [
    {
      id: "clock_in_out",
      title: useFormatMessage("modules.attendance.title.clock_in_out"),
      component: <ClockInOutWidget {...props} noIcon progressWidth={80} />,
      data_grid: {
        i: "clock_in_out",
        x: 8,
        y: 0,
        w: 1,
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
      component: <Notepad {...props} noIcon layoutSmall />,
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
      id: "events",
      title: useFormatMessage("modules.dashboard.events.title"),
      component: <CardEvent {...props} noIcon />,
      data_grid: {
        i: "events",
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
