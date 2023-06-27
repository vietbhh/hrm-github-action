import { useFormatMessage } from "@apps/utility/common"
import WidgetPreview1 from "@apps/modules/dashboard/assets/images/WidgetPreview1.svg"
import CardAnnouncements from "@apps/modules/dashboard/main/components/CardAnnouncements"
import Notepad from "@apps/modules/dashboard/main/components/Notepad"

const BackgroundWidget = () => {
  return <img className="img" src={WidgetPreview1} />
}

export const ListComponentConfig = (props) => {
  return [
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
      id: "announcement",
      title: useFormatMessage("modules.dashboard.announcement.title"),
      component: <CardAnnouncements {...props} noIcon />,
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
