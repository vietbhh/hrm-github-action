// ** React Imports
import { isEmpty } from "lodash"
import { cloneElement, Fragment, lazy } from "react"
// ** Routes Imports
import CoreRoutes from "./Core"
import DriveRoutes from "./Drive"

// ** Layouts
import LayoutWrapper from "@core/layouts/components/layout-wrapper"

// ** Route Components
import PrivateRoute from "@components/routes/PrivateRoute"
import PublicRoute from "@components/routes/PublicRoute"

// ** Utils
import { isUndefined } from "@apps/utility/handleData"
import {
  defaultLayout as defaultLayoutConfig,
  layoutConfig,
  layoutList
} from "@src/layouts/config"
import { isObjEmpty } from "@utils"
import { Navigate } from "react-router-dom"
const getLayout = layoutConfig

// ** Document title
const TemplateTitle = "%s - Friday"

// ** Default Route
const DefaultRoute = "/dashboard"

// ** Merge Routes
const Routes = [...CoreRoutes, ...DriveRoutes]
const getRouteMeta = (route) => {
  if (isObjEmpty(route.element.props)) {
    if (route.meta) {
      return { routeMeta: route.meta }
    } else {
      return {}
    }
  }
}

const handleRouteParams = (route) => {
  const path = route.path.slice(1)
  const listRoutes = []
  if (path.includes("?")) {
    const hasChild = path.split("/")
    hasChild.forEach((item, index) => {
      const newChild = [...hasChild]
      if (item.endsWith("?")) {
        newChild.length = index
        listRoutes.push({
          ...route,
          path: newChild.join("/").replaceAll("?", "")
        })
        if (index === hasChild.length - 1) {
          listRoutes.push({
            ...route,
            path: hasChild.join("/").replaceAll("?", "")
          })
        }
      }
    })
  } else {
    listRoutes.push(route)
  }
  return listRoutes
}

// ** Return Filtered Array of Routes & Paths
const MergeLayoutRoutes = (layout, defaultLayout, listRoutes) => {
  const LayoutRoutes = []
  if (listRoutes) {
    listRoutes.filter((route) => {
      let isBlank = false
      // ** Checks if Route layout or Default layout matches current layout
      if (
        (route.meta && route.meta.layout && route.meta.layout === layout) ||
        ((route.meta === undefined || route.meta.layout === undefined) &&
          defaultLayout === layout)
      ) {
        let RouteTag = PrivateRoute

        // ** Check for public or private route
        if (route.meta) {
          route.meta.layout === "blank" ? (isBlank = true) : (isBlank = false)
          RouteTag = route.meta.publicRoute ? PublicRoute : PrivateRoute
        }
        if (route.element) {
          const Wrapper =
            // eslint-disable-next-line multiline-ternary
            isObjEmpty(route.element.props) && isBlank === false
              ? // eslint-disable-next-line multiline-ternary
                LayoutWrapper
              : Fragment
          route.element = (
            <Wrapper {...(isBlank === false ? getRouteMeta(route) : {})}>
              <RouteTag route={route}>
                {isUndefined(route.module)
                  ? route.element
                  : cloneElement(route.element, {
                      route: { module: route.module }
                    })}
              </RouteTag>
            </Wrapper>
          )
        }
        const routes = handleRouteParams(route)
        // Push route to LayoutRoutes
        LayoutRoutes.push(...routes)
      }
      return LayoutRoutes
    })
  }
  return LayoutRoutes
}

const getRoutes = (layout, customRoutes, defaultDashboardComponent) => {
  const defaultLayout = layout || defaultLayoutConfig
  const layouts = layoutList

  const AllRoutes = []
  const listRoutes = []
  const DefaultComp = lazy(() =>
    import(`../../@apps/modules/default/pages/DefaultModule.js`)
  )
  const AllRoutePaths = []
  customRoutes.forEach((item) => {
    let Comp = DefaultComp
    let moduleProps = { module: item }
    if (
      !isEmpty(item.componentPath) &&
      item.componentPath !== "default_route"
    ) {
      Comp = lazy(() =>
        import(
          /* @vite-ignore */ "../../@modules/" + item.componentPath + ".js"
        )
      )
      moduleProps = {}
    }
    const routeOption = isUndefined(item.options?.routes?.meta)
      ? {}
      : item.options?.routes?.meta

    const customRouteMeta = isUndefined(item?.meta) ? {} : item?.meta
    const isPublic = item.isPublic || false
    const publicRouteProps = isPublic ? { publicRoute: isPublic } : {}
    const routePermit =
      !isEmpty(item.permitAction) && !isEmpty(item.permitResource)
        ? {
            action: item.permitAction,
            resource: item.permitResource
          }
        : { action: "login", resource: "app" }
    AllRoutePaths.push(item.routePath)
    listRoutes.push({
      path: item.routePath,
      element: isEmpty(item.redirectPath) ? (
        <Comp />
      ) : (
        <Navigate to={item.redirectPath} replace />
      ),
      meta: {
        className: item.fullWidth === "yes" ? "erp-fullWidth" : "",
        ...routePermit,
        ...publicRouteProps,
        ...routeOption,
        ...customRouteMeta
      },
      ...moduleProps
    })
  })

  if (!isEmpty(defaultDashboardComponent)) {
    const DashboardComp = lazy(() =>
      import(
        /* @vite-ignore */ "../../@modules/" + defaultDashboardComponent + ".js"
      )
    )
    listRoutes.push({
      path: "/dashboard",
      element: <DashboardComp />,
      meta: {
        action: "login",
        resource: "app"
      }
    })
  }

  Routes.forEach((item) => {
    if (!AllRoutePaths.includes(item.path)) listRoutes.push(item)
  })

  layouts.forEach((layoutItem) => {
    const LayoutRoutes = MergeLayoutRoutes(
      layoutItem,
      defaultLayout,
      listRoutes
    )
    AllRoutes.push({
      path: "/",
      element: getLayout[layoutItem] || getLayout[defaultLayout],
      children: LayoutRoutes
    })
  })
  return AllRoutes
}

export { DefaultRoute, TemplateTitle, Routes, getRoutes }
