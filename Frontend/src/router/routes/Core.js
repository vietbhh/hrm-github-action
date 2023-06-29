import { lazy } from "react"
const Dashboard = lazy(() =>
  import("@apps/modules/dashboard/main/pages/MainDashboard")
)
const DownloadFile = lazy(() =>
  import("@apps/modules/download/pages/DownloadFile")
)
const AppSetting = lazy(() => import("@apps/modules/settings/pages/AppSetting"))
const GeneralSetting = lazy(() =>
  import("@apps/modules/settings/pages/GeneralSetting")
)
const ModulesSetting = lazy(() =>
  import("@apps/modules/settings/pages/ModulesSetting")
)
const UsersSetting = lazy(() =>
  import("@apps/modules/settings/pages/UsersSetting")
)
const OfficesSetting = lazy(() =>
  import("@apps/modules/settings/pages/OfficesSetting")
)
const DepartmentsSetting = lazy(() =>
  import("@apps/modules/settings/pages/DepartmentsSetting")
)
const GroupsSetting = lazy(() =>
  import("@apps/modules/settings/pages/GroupsSetting")
)
const JobTitlesSetting = lazy(() =>
  import("@apps/modules/settings/pages/JobTitlesSetting")
)
const PermitsSetting = lazy(() =>
  import("@apps/modules/settings/pages/PermitsSetting")
)
const Login = lazy(() => import("@apps/modules/authentication/Login"))
const ForgotPassword = lazy(() =>
  import("@apps/modules/authentication/ForgotPassword")
)
const ResetPassword = lazy(() =>
  import("@apps/modules/authentication/ResetPassword")
)
const Activation = lazy(() => import("@apps/modules/authentication/Activation"))
const Maintenance = lazy(() => import("@apps/modules/misc/Maintenance"))
const NotAuthorized = lazy(() => import("@apps/modules/misc/NotAuthorized"))
const Restrict = lazy(() => import("@apps/modules/misc/Restrict"))
const Error = lazy(() => import("@apps/modules/misc/Error"))

const Start = lazy(() => import("@apps/modules/misc/Start"))
const Faq = lazy(() => import("@apps/modules/misc/faq/index"))
const Tasks = lazy(() => import("@apps/modules/tasks/index"))
const Profile = lazy(() => import("@apps/modules/users/pages/Profile"))
const User = lazy(() => import("@apps/modules/users/pages/User"))
const Calendar = lazy(() =>
  import("@apps/modules/calendar/pages/CalendarIndex")
)
const Notification = lazy(() =>
  import("@apps/modules/notification/pages/NotificationIndex")
)

const Chat = lazy(() => import("@apps/modules/chat/pages/index"))
const Test = lazy(() => import("@apps/modules/misc/Test"))

const CoreRoutes = [
  {
    path: "/dashboard",
    element: <Dashboard />,
    meta: {
      action: "login",
      resource: "app"
    }
  },

  {
    path: "/download/:filepath+",
    element: <DownloadFile />,
    meta: {
      action: "download",
      resource: "sys"
    }
  },
  {
    path: "/settings/app/:action?/:id?",
    element: <AppSetting />,
    meta: {
      layout: "empty",
      action: "manage",
      resource: "app"
    }
  },
  {
    path: "/settings/general",
    element: <GeneralSetting />,
    meta: {
      layout: "empty",
      action: "manage",
      resource: "app"
    }
  },
  {
    path: "/settings/modules",
    element: <ModulesSetting />,
    meta: {
      layout: "empty",
      action: "modules",
      resource: "sys"
    }
  },
  {
    path: "/settings/users/:action?/:id?",
    element: <UsersSetting />,
    meta: {
      layout: "empty",
      action: "manage",
      resource: "users"
    }
  },
  {
    path: "/settings/offices/:action?/:id?",
    element: <OfficesSetting />,
    meta: {
      layout: "empty",
      action: "manage",
      resource: "offices"
    }
  },
  {
    path: "/settings/departments/:action?/:id?",
    element: <DepartmentsSetting />,
    meta: {
      layout: "empty",
      action: "manage",
      resource: "departments"
    }
  },
  {
    path: "/settings/groups/:action?/:id?",
    element: <GroupsSetting />,
    meta: {
      layout: "empty",
      action: "manage",
      resource: "groups"
    }
  },
  {
    path: "/settings/job-titles/:action?/:id?",
    element: <JobTitlesSetting />,
    meta: {
      layout: "empty",
      action: "manage",
      resource: "job_titles"
    }
  },
  {
    path: "/settings/permissions",
    element: <PermitsSetting />,
    meta: {
      layout: "empty",
      action: "manage",
      resource: "permits"
    }
  },
  {
    path: "/login",
    element: <Login />,
    meta: {
      layout: "blank",
      publicRoute: true,
      restricted: true
    }
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    meta: {
      layout: "blank",
      publicRoute: true,
      restricted: true
    }
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
    meta: {
      layout: "blank",
      publicRoute: true,
      restricted: true
    }
  },
  {
    path: "/activation/:token",
    element: <Activation />,
    meta: {
      layout: "blank",
      publicRoute: true,
      restricted: true
    }
  },
  {
    path: "/maintenance",
    element: <Maintenance />,
    meta: {
      layout: "blank",
      publicRoute: true
    }
  },
  {
    path: "/not-authorized",
    element: <NotAuthorized />,
    meta: {
      layout: "blank",
      publicRoute: true
    }
  },
  {
    path: "/restrict",
    element: <Restrict />,
    meta: {
      layout: "blank",
      publicRoute: true
    }
  },
  {
    path: "/error",
    element: <Error />,
    meta: {
      layout: "blank",
      publicRoute: true
    }
  },
  {
    path: "/start",
    element: <Start />,
    meta: {
      layout: "blank",
      action: "login",
      resource: "app"
    }
  },
  {
    path: "/faq",
    element: <Faq />,
    meta: {
      action: "login",
      resource: "app"
    }
  },
  {
    path: "/tasks",
    element: <Tasks />,
    meta: {
      action: "login",
      resource: "app"
    }
  },
  {
    path: "/profile/:tab?",
    element: <Profile />,
    meta: {
      action: "login",
      resource: "app",
      className: "erp-fullWidth"
    }
  },
  {
    path: "/user/:identity/:tab?",
    element: <User />,
    meta: {
      action: "login",
      resource: "app",
      className: "erp-fullWidth"
    }
  },
  {
    path: "/calendar",
    element: <Calendar />,
    meta: {
      layout: "empty",
      action: "login",
      resource: "app",
      className: "erp-fullWidth"
    }
  },
  {
    path: "/notification",
    element: <Notification />,
    meta: {
      action: "login",
      resource: "app",
      className: "",
      layout: "empty"
    }
  },
  {
    path: "/misc/test",
    element: <Test />,
    meta: {
      action: "login",
      resource: "app",
      className: "",
      layout: "separateSidebar"
    }
  },
  {
    path: "/chat/:id?",
    element: <Chat />,
    meta: {
      action: "login",
      resource: "app",
      appLayout: true,
      className: "chat-application",
      layout: "chat"
    }
  }
]

export default CoreRoutes
