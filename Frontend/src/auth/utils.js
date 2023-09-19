import { initAppData, initAppRoutes } from "@store/app/app"
import { updateListUsers } from "@store/app/users"
import { handleFetchProfile } from "@store/authentication"
import { initialLayout } from "@store/layout"
import { handleNotification } from "@store/notification"
import { store } from "@store/store"
import jwt from "./jwt/useJwt"
/**
 * Return if user is logged in
 * This is completely up to you and how you want to store the token in your frontend application
 * e.g. If you are using cookies to store the application please update this function
 */
// eslint-disable-next-line arrow-body-style
export const isUserLoggedIn = () => {
  return (
    localStorage.getItem("userData") &&
    localStorage.getItem(jwt.jwtConfig.storageTokenKeyName)
  )
}

export const getUserData = () => JSON.parse(localStorage.getItem("userData"))

/***
 *
 * FRIDAY CUSTOM
 *
 */

export const fetchProfile = () => {
  return new Promise((resolve) => {
    jwt.profile().then((res) => {
      const {
        userData,
        permits,
        init: { settings, unit, modules, routes, filters, optionsModules },
        list_user
      } = res.data

      const listNotification = res.data.list_notification ?? []
      const numberNotification = res.data.number_notification ?? 0
      store.dispatch(initialLayout(settings))
      setIndexCustom(settings)
      store.dispatch(
        handleFetchProfile({
          userData,
          permits,
          settings
        })
      )
      store.dispatch(
        initAppData({ unit, modules, routes, optionsModules, filters })
      )
      store.dispatch(updateListUsers(list_user))
      // ** save notification to redux
      store.dispatch(
        handleNotification({
          listNotification,
          numberNotification
        })
      )

      resolve({ permits, settings })
    })
  })
}

export const authSetting = () => {
  return new Promise((resolve) => {
    jwt.setting().then((res) => {
      store.dispatch(initAppRoutes(res.data.routes))
      store.dispatch(initialLayout(res.data.settings))
      setIndexCustom(res.data.settings)
      resolve(res.data)
    })
  })
}

const setIndexCustom = (data) => {
  const { indexCustomPath, indexCustomLayout, indexCustomComponent } = data
  localStorage.setItem(
    "indexCustom",
    JSON.stringify({
      indexCustomPath,
      indexCustomLayout,
      indexCustomComponent
    })
  )
}
