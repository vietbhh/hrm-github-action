import AppLoadingBar from "@apps/components/common/AppLoadingBar"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import React, { Suspense, useContext, useEffect } from "react"
import { Helmet } from "react-helmet"
import { useSelector } from "react-redux"
import { requestPermission } from "./firebase"
import Notification from "@apps/components/notification/Notification"
// ** Router Import
import Router from "./router/Router"
import SocketContext from "./utility/context/Socket"

const App = () => {
  const appLoading = useSelector((state) => state.app.loading)
  const routes = useSelector((state) => state.app.routes)
  const appName = useSelector((state) => state.layout.app_name)
  const defaultDashboardComponent = useSelector(
    (state) => state.auth.settings.dashboardComponent
  )
  const socket = useContext(SocketContext)
  // ** effect
  useEffect(() => {
    requestPermission()
    console.log(socket)

    socket.emit("identity", 123)

    return () => {
      socket.off("identity")
    }
  }, [])
  
  return appLoading ? (
    <AppSpinner />
  ) : (
    <Suspense fallback={null}>
      <Helmet defaultTitle={appName} titleTemplate={`%s | ${appName}`} />
      <AppLoadingBar />
      <Notification />
      <Router
        customRoutes={routes}
        defaultDashboardComponent={defaultDashboardComponent}
      />
    </Suspense>
  )
}

export default App
