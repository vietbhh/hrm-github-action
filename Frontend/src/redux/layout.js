// ** Redux Imports
// ** ThemeConfig Import
import themeConfig from "@configs/themeConfig"
import { createSlice } from "@reduxjs/toolkit"
import { updateUserSetting } from "./api"

const initialMenuCollapsed = () => {
  const item = window.localStorage.getItem("menuCollapsed")
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : themeConfig.layout.menu.isCollapsed
}

const initialDirection = () => {
  const item = window.localStorage.getItem("direction")
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : themeConfig.layout.isRTL
}

const initialSkin = () => {
  const item = window.localStorage.getItem("skin")
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : themeConfig.layout.skin
}

export const layoutSlice = createSlice({
  name: "layout",
  initialState: {
    skin: initialSkin(),
    isRTL: initialDirection(),
    layout: themeConfig.layout.type,
    lastLayout: themeConfig.layout.type,
    menuCollapsed: initialMenuCollapsed(),
    footerType: themeConfig.layout.footer.type,
    navbarType: themeConfig.layout.navbar.type,
    menuHidden: themeConfig.layout.menu.isHidden,
    contentWidth: themeConfig.layout.contentWidth,
    navbarColor: themeConfig.layout.navbar.backgroundColor,
    app_name: themeConfig.app.appName,
    logo_default: themeConfig.app.appLogoImage,
    logo_white: themeConfig.app.appLogoImage,
    logo_black: themeConfig.app.appLogoImage,
    favicon: themeConfig.app.appLogoImage,
    language: "en",
    loadingDashboard: false
  },
  reducers: {
    handleRTL: (state, action) => {
      state.isRTL = action.payload
      window.localStorage.setItem("direction", JSON.stringify(action.payload))
      updateUserSetting("isRtl", action.payload)
    },
    handleSkin: (state, action) => {
      state.skin = action.payload
      window.localStorage.setItem("skin", JSON.stringify(action.payload))
      updateUserSetting("skin", action.payload)
    },
    handleLayout: (state, action) => {
      state.layout = action.payload
      //updateUserSetting("layout", action.payload) //Update from hook for custom save on resize action
    },
    handleFooterType: (state, action) => {
      state.footerType = action.payload
      updateUserSetting("footerType", action.payload)
    },
    handleNavbarType: (state, action) => {
      state.navbarType = action.payload
      updateUserSetting("navbarType", action.payload)
    },
    handleMenuHidden: (state, action) => {
      state.menuHidden = action.payload
      updateUserSetting("hideMenu", action.payload)
    },
    handleLastLayout: (state, action) => {
      state.lastLayout = action.payload
    },
    handleNavbarColor: (state, action) => {
      state.navbarColor = action.payload
      updateUserSetting("navbarColor", action.payload)
    },
    handleContentWidth: (state, action) => {
      state.contentWidth = action.payload
      updateUserSetting("contentWidth", action.payload)
    },
    handleMenuCollapsed: (state, action) => {
      state.menuCollapsed = action.payload
      window.localStorage.setItem(
        "menuCollapsed",
        JSON.stringify(action.payload)
      )
      state.loadingDashboard = true
      updateUserSetting("sidebarCollapsed", action.payload)
    },
    handleLanguage: (state, action) => {
      state.language = action.payload
      updateUserSetting("language", action.payload)
    },
    updateLoadingDashboard: (state, action) => {
      state.loadingDashboard = action.payload
    },
    initialLayout: (state, action) => {
      const {
        app_name,
        logo_default,
        logo_white,
        logo_black,
        favicon,
        isRtl,
        sidebarCollapsed,
        hideMenu,
        contentWidth,
        navbarType,
        navbarColor,
        footerType,
        skin,
        layout,
        language,
        loadingDashboard
      } = action.payload
      state.skin = skin
      state.isRTL = isRtl
      state.layout = layout
      state.lastLayout = layout
      state.menuCollapsed = sidebarCollapsed
      state.footerType = footerType
      state.navbarType = navbarType
      state.menuHidden = hideMenu
      state.contentWidth = contentWidth
      state.navbarColor = navbarColor
      state.app_name = app_name
      state.logo_default = logo_default
      state.logo_white = logo_white
      state.logo_black = logo_black
      state.favicon = favicon
      state.language = language
      state.loadingDashboard = loadingDashboard
    }
  }
})

export const {
  handleRTL,
  handleSkin,
  handleLayout,
  handleLastLayout,
  handleMenuHidden,
  handleNavbarType,
  handleFooterType,
  handleNavbarColor,
  handleContentWidth,
  handleMenuCollapsed,
  handleLanguage,
  updateLoadingDashboard,
  initialLayout
} = layoutSlice.actions

export default layoutSlice.reducer
