import AppLoadingBar from "@apps/components/common/AppLoadingBar"
import Notification from "@apps/components/notification/Notification"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import React, { Suspense, useEffect } from "react"
import { Helmet } from "react-helmet"
import { useSelector } from "react-redux"
import { requestPermission } from "./firebase"
// ** Router Import
import Router from "./router/Router"

const App = () => {
  const appLoading = useSelector((state) => state.app.loading)
  const routes = useSelector((state) => state.app.routes)
  const appName = useSelector((state) => state.layout.app_name)
  const userData = useSelector((state) => state.auth.userData)

  const customIndex = JSON.parse(localStorage.getItem("indexCustom"))
  const defaultIndexPath = customIndex?.indexCustomPath || ""

  const defaultDashboardComponent = useSelector(
    (state) => state.auth.settings.dashboardComponent
  )
  const appTitle = useSelector((state) => state.app.title)
  // ** effect
  useEffect(() => {
    if (!_.isEmpty(userData)) requestPermission()
  }, [userData])

  return appLoading ? (
    <AppSpinner />
  ) : (
    <Suspense fallback={null}>
      <Helmet
        defaultTitle={appName}
        titleTemplate={`%s | ${appName}`}
        defer={false}>
        {!_.isEmpty(appTitle) && <title>{appTitle}</title>}
      </Helmet>
      <AppLoadingBar />
      <Notification />
      <Router
        customRoutes={routes}
        defaultIndexPath={defaultIndexPath}
        defaultDashboardComponent={defaultDashboardComponent}
      />
    </Suspense>
  )
}

export default App
