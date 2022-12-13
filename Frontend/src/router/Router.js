// ** Router imports

// ** Router imports
import { Navigate, useRoutes } from "react-router-dom"

// ** Layouts
import BlankLayout from "@layouts/BlankLayout"

// ** Hooks Imports
import { useLayout } from "@hooks/useLayout"

// ** Utils
import { getHomeRouteForLoggedInUser, getUserData } from "../utility/Utils"

// ** GetRoutes
import Error from "@apps/modules/misc/Error"
import NotAuthorized from "@apps/modules/misc/NotAuthorized"
import { getRoutes } from "./routes"

// ** Components

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
