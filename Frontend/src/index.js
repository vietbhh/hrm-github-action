// ** React Imports
import AppSpinner from "@apps/components/spinner/AppSpinner"
// ** React Hot Toast Styles
import "@styles/react/libs/react-hot-toasts/react-hot-toasts.scss"
import { authSetting, fetchProfile, isUserLoggedIn } from "auth/utils"
// ** PrismJS
import "prismjs"
import "prismjs/components/prism-jsx.min"
import "prismjs/themes/prism-tomorrow.css"
import { lazy, Suspense } from "react"
import { createRoot } from "react-dom/client"
// ** Toast
import { Toaster } from "react-hot-toast"
// ** React Perfect Scrollbar
import "react-perfect-scrollbar/dist/css/styles.css"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { handleAppLoading } from "redux/app/app"
import "./assets/scss/antd.less"
import "./assets/scss/rsuite.less"
// ** Core styles
import "./@core/assets/fonts/feather/iconfont.css"
// ** Ripple Button
import "./@core/components/ripple-button"
import "./@core/scss/core.scss"
import "./assets/plugins/fontawesome/css/all.min.css"
// ** Fake Database
import "./@fake-db"
import "./assets/scss/style.scss"
// ** Intl, CASL & ThemeColors Context
import ability from "./configs/acl/ability"
// ** i18n
import i18n from "./configs/i18n"
// ** ThemeConfig
import themeConfig from "./configs/themeConfig"
// ** Redux Imports
import { store } from "./redux/store"
// ** Service Worker
import * as serviceWorker from "./serviceWorker"
import { AbilityContext } from "./utility/context/Can"
import { ThemeContext } from "./utility/context/ThemeColors"
import { SocketContextWrap } from "utility/context/Socket"

// ** Lazy load app
const LazyApp = lazy(() => import("./App"))
if (isUserLoggedIn()) {
  store.dispatch(handleAppLoading(true))
  fetchProfile().then(({ permits, settings }) => {
    ability.update(permits)
    store.dispatch(handleAppLoading(false))
    i18n.changeLanguage(settings.language)
  })
} else {
  store.dispatch(handleAppLoading(true))
  authSetting().then(({ settings }) => {
    store.dispatch(handleAppLoading(false))
    i18n.changeLanguage(settings.language)
  })
}
const container = document.getElementById("root")
const root = createRoot(container)
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <Suspense fallback={<AppSpinner />}>
        <AbilityContext.Provider value={ability}>
          <ThemeContext>
            <SocketContextWrap>
              <LazyApp />
              <Toaster
                position={themeConfig.layout.toastPosition}
                toastOptions={{ className: "react-hot-toast" }}
              />
            </SocketContextWrap>
          </ThemeContext>
        </AbilityContext.Provider>
      </Suspense>
    </Provider>
  </BrowserRouter>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
