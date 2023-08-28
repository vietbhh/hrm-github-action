// ** Router imports
// ** Router imports
import { Navigate, useRoutes } from "react-router-dom"

// ** Layouts
import BlankLayout from "@layouts/BlankLayout"

// ** Hooks Imports
import { useLayout } from "@hooks/useLayout"

// ** Utils
import { getHomeRouteForLoggedInUser } from "../utility/Utils"

// ** GetRoutes
import NotAuthorized from "@apps/modules/misc/NotAuthorized"
import NotFoundAuth from "@apps/modules/misc/NotFoundAuth"
import { getRoutes } from "./routes"

// ** Components

const Router = (props) => {
  // ** Hooks
  const { customRoutes, defaultIndexPath, defaultDashboardComponent } = props
  const { layout } = useLayout()

  const allRoutes = getRoutes(layout, customRoutes, defaultDashboardComponent)
  let homeRoute = "/login"

  homeRoute = getHomeRouteForLoggedInUser()
  if (
    !_.isUndefined(defaultIndexPath) &&
    !_.isNull(defaultIndexPath) &&
    !_.isEmpty(defaultIndexPath)
  ) {
    homeRoute = defaultIndexPath
  }
  const indexItem = {
    path: "/",
    index: true,
    element: <Navigate replace to={homeRoute} />
  }
  const routes = useRoutes([
    indexItem,
    ...allRoutes,
    {
      path: "/auth/not-auth",
      element: <BlankLayout />,
      children: [{ path: "/auth/not-auth", element: <NotAuthorized /> }]
    },
    {
      path: "*",
      element: <BlankLayout />,
      children: [{ path: "*", element: <NotFoundAuth /> }]
    }
  ])
  return routes
}

export default Router
