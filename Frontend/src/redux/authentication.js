// ** Redux Imports
import { userApi } from "@apps/modules/users/common/api"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

// ** UseJWT import to get config
import useJwt from "@src/auth/jwt/useJwt"

const config = useJwt.jwtConfig

export const handleLogout = createAsyncThunk(
  "authentication/handleLogout",
  async () => {
    await userApi.removeDeviceToken()
    return true
  }
)

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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleLogout.fulfilled, (state, action) => {
        state.userData = {}
        state.settings = {}
        state.permits = []
        state[config.storageTokenKeyName] = null
        state[config.storageRefreshTokenKeyName] = null
        // ** Remove user, accessToken & refreshToken from localStorage
        const customIndex = localStorage.getItem("indexCustom")
        localStorage.clear()
        localStorage.setItem("indexCustom", customIndex)
      })
      .addCase(handleLogout.rejected, (state, action) => {
        state.userData = {}
        state.settings = {}
        state.permits = []
        state[config.storageTokenKeyName] = null
        state[config.storageRefreshTokenKeyName] = null
        // ** Remove user, accessToken & refreshToken from localStorage
        const customIndex = localStorage.getItem("indexCustom")
        localStorage.clear()
        localStorage.setItem("indexCustom", customIndex)
      })
  }
})

export const { handleLogin, handleFetchProfile } = authSlice.actions

export default authSlice.reducer
