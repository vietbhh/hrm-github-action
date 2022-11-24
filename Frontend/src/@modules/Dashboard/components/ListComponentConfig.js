import WidgetPreview1 from "@apps/modules/dashboard/assets/images/WidgetPreview1.svg"
import CardCalendar from "./CardCalendar"
import Notepad from "@apps/modules/dashboard/main/components/Notepad"
import { useFormatMessage } from "@apps/utility/common"
import CardAnnouncements from "./CardAnnouncements"
import CardAttendanceToDay from "./CardAttendanceToDay"
import CarBirthday from "./CardBirthday"
import CardEmployees from "./CardEmployees"
import CardWorkOff from "./CardWorkOff"
import ClockInOutWidget from "./details/clock/ClockInOutWidget"
import FollowUp from "./details/follow/FollowUp"
import MyTimeOff from "./MyTimeOff"
import PendingApproval from "./PendingApproval"

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
        h: 14,
        minW: 4,
        minH: 2,
        maxW: 8,
        maxH: 14,
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
        y: 14,
        w: 8,
        h: 13,
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
        y: 27,
        w: 8,
        h: 11,
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
      id: "pending_approval",
      title: useFormatMessage("modules.dashboard.pending_approval"),
      component: <PendingApproval {...props} />,
      data_grid: {
        i: "pending_approval",
        x: 0,
        y: 38,
        w: 8,
        h: 11,
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
      id: "follow_up",
      title: useFormatMessage("modules.checklist.title.follow_up"),
      component: <FollowUp {...props} />,
      data_grid: {
        i: "follow_up",
        x: 0,
        y: 49,
        w: 8,
        h: 11,
        minW: 4,
        minH: 2,
        maxW: 8,
        //maxH: 12,
        static: false,
        isDraggable: true
      },
      background: <BackgroundWidget />,
      show: false,
      action: "follow_up",
      resource: "widget"
    },
    {
      id: "clock_in_out",
      title: useFormatMessage("modules.attendance.title.clock_in_out"),
      component: <ClockInOutWidget {...props} />,
      data_grid: {
        i: "clock_in_out",
        x: 8,
        y: 0,
        w: 4,
        h: 10,
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
      id: "employees",
      title: useFormatMessage("modules.dashboard.employees"),
      component: <CardEmployees {...props} />,
      data_grid: {
        i: "employees",
        x: 8,
        y: 10,
        w: 4,
        h: 8,
        minW: 4,
        minH: 2,
        maxW: 8,
        //maxH: 12,
        static: false,
        isDraggable: true
      },
      background: <BackgroundWidget />,
      show: false,
      action: "employees",
      resource: "widget"
    },
    {
      id: "attendance_to_day",
      title: useFormatMessage("modules.dashboard.attendance_to_day"),
      component: <CardAttendanceToDay {...props} />,
      data_grid: {
        i: "attendance_to_day",
        x: 8,
        y: 18,
        w: 4,
        h: 9,
        minW: 4,
        minH: 2,
        maxW: 8,
        //maxH: 12,
        static: false,
        isDraggable: true
      },
      background: <BackgroundWidget />,
      show: false,
      action: "attendance_to_day",
      resource: "widget"
    },
    {
      id: "who_off_today",
      title: useFormatMessage("modules.dashboard.who_off_today"),
      component: <CardWorkOff {...props} />,
      data_grid: {
        i: "who_off_today",
        x: 8,
        y: 27,
        w: 4,
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
      action: "who_off_today",
      resource: "widget"
    },
    {
      id: "birthday_this_month",
      title: useFormatMessage("modules.dashboard.birthday_this_month"),
      component: <CarBirthday {...props} />,
      data_grid: {
        i: "birthday_this_month",
        x: 8,
        y: 33,
        w: 4,
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
      id: "my_time_off",
      title: useFormatMessage("modules.dashboard.my_time_off"),
      component: <MyTimeOff {...props} />,
      data_grid: {
        i: "my_time_off",
        x: 8,
        y: 39,
        w: 4,
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
    }
  ]
}
