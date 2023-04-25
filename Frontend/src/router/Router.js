// ** Router imports
import { lazy } from "react"
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
import {
  defaultLayout as defaultLayoutConfig
} from "@src/layouts/config"

const Router = (props) => {
  // ** Hooks
  const {
    customRoutes,
    defaultIndexPath,
    defaultIndexComponent,
    defaultIndexLayout,
    defaultDashboardComponent
  } = props
  const { layout } = useLayout()

  const allRoutes = getRoutes(layout, customRoutes, defaultDashboardComponent)
  const user = getUserData()
  let homeRoute = "/login"

  /* let indexItem = {
    path: "/",
    index: true,
    element: <Navigate replace to={homeRoute} />
  } */

  if (user) {
    //CustomIndexUnderContructor
    if (
      !_.isUndefined(defaultIndexComponent) &&
      !_.isNull(defaultIndexComponent) &&
      !_.isEmpty(defaultIndexComponent)
    ) {
      let indexLayout = defaultLayoutConfig
      if (
        !_.isUndefined(defaultIndexLayout) &&
        !_.isNull(defaultIndexLayout) &&
        !_.isEmpty(defaultIndexLayout)
      ) {
        indexLayout = defaultIndexLayout
      }
      /* const CustomIndexComponent = lazy(() =>
        import(`@src/${defaultIndexComponent}`)
      ) */
      const Test = lazy(() => import("@apps/modules/misc/TestUploadService"))
      /* indexItem = {
        path: "/",
        element: layoutConfig[indexLayout],
        children: [{ path: "/", element: <Test /> }]
      } */
    }
    //CustomIndexENDUnderContructor

    homeRoute = getHomeRouteForLoggedInUser(user.role)
    if (
      !_.isUndefined(defaultIndexPath) &&
      !_.isNull(defaultIndexPath) &&
      !_.isEmpty(defaultIndexPath)
    ) {
      homeRoute = defaultIndexPath
    }
  }
  const indexItem = {
    path: "/",
    index: true,
    element: <Navigate replace to={homeRoute} />
  }

  const routes = useRoutes([
    indexItem,
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
