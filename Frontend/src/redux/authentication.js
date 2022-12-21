// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit"

// ** UseJWT import to get config
import useJwt from "@src/auth/jwt/useJwt"
import { useContext } from "react"
import SocketContext from "utility/context/Socket"

const config = useJwt.jwtConfig

export const authSlice = createSlice({
  name: "authentication",
  initialState: {
    userData: {},
    permits: [],
    settings: {}
  },
  reducers: {
    handleLogin: (state, action) => {
      const { userData, settings, permits, accessToken, refreshToken } =
        action.payload
      // ** Add user to State
      state.userData = userData
      state.settings = settings
      state.permits = permits
      state[config.storageTokenKeyName] = accessToken
      state[config.storageRefreshTokenKeyName] = refreshToken
      // ** Add user to localStorage
      localStorage.setItem("userData", JSON.stringify(userData))
      localStorage.setItem("settings", JSON.stringify(settings))
      localStorage.setItem(
        "quick_access",
        JSON.stringify(settings.quick_access)
      )
      localStorage.setItem(config.storageTokenKeyName, accessToken)
      localStorage.setItem(config.storageRefreshTokenKeyName, refreshToken)
    },
    handleFetchProfile: (state, action) => {
      const { userData, settings, permits } = action.payload
      // ** Update user in State
      state.userData = userData
      state.settings = settings
      state.permits = permits
      // ** Update user in localStorage
      localStorage.setItem("userData", JSON.stringify(userData))
      localStorage.setItem("settings", JSON.stringify(settings))
    },
    handleLogout: (state) => {
      state.userData = {}
      state.settings = {}
      state.permits = []
      state[config.storageTokenKeyName] = null
      state[config.storageRefreshTokenKeyName] = null
      // ** Remove user, accessToken & refreshToken from localStorage
      localStorage.clear()
    }
  }
})

export const { handleLogin, handleFetchProfile, handleLogout } =
  authSlice.actions

export default authSlice.reducer
