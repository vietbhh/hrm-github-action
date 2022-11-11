// ** Router imports
import { lazy } from "react"

// ** Router imports
import { Navigate, useLocation, useRoutes } from "react-router-dom"

// ** Layouts
import BlankLayout from "@layouts/BlankLayout"

// ** Hooks Imports
import { useLayout } from "@hooks/useLayout"

// ** Utils
import { getHomeRouteForLoggedInUser, getUserData } from "../utility/Utils"

// ** GetRoutes
import { getRoutes } from "./routes"

// ** Components
const Error = lazy(() => import("../views/pages/misc/Error"))
const NotAuthorized = lazy(() => import("../views/pages/misc/NotAuthorized"))

const Router = (props) => {
  // ** Hooks
  const { customRoutes, defaultDashboardComponent } = props
  const { layout } = useLayout()

  const allRoutes = getRoutes(layout, customRoutes, defaultDashboardComponent)
  const getHomeRoute = () => {
    const user = getUserData()
    if (user) {
      return getHomeRouteForLoggedInUser(user.role)
    } else {
      return "/login"
    }
  }

  const routes = useRoutes([
    {
      path: "/",
      index: true,
      element: <Navigate replace to={getHomeRoute()} />
    },
    {
      path: "/auth/not-auth",
      element: <BlankLayout />,
      children: [{ path: "/auth/not-auth", element: <NotAuthorized /> }]
    },
    {
      path: "*",
      element: <BlankLayout />,
      children: [{ path: "*", element: <Error /> }]
    },
    ...allRoutes
  ])

  return routes
}

export default Router
