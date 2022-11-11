// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit"

export const appSlice = createSlice({
  name: "app",
  initialState: {
    unit: { provinces: [], districts: [], wards: [] },
    appError: {
      status: false,
      msg: ""
    },
    loading: false,
    modules: {},
    routes: [],
    filters: {}
  },
  reducers: {
    initAppData: (state, action) => {
      const { unit, modules, routes, filters, optionsModules } = action.payload
      state.unit = unit
      state.modules = modules
      state.routes = routes
      state.optionsModules = optionsModules
      state.filters = filters
    },
    initAppRoutes: (state, action) => {
      state.routes = action.payload
    },
    handleAppLoading: (state, action) => {
      state.loading = action.payload
    },
    showAppError: (state, action) => {
      state.appError = {
        status: true,
        msg: action.payload
      }
    },
    dismissAppError: (state) => {
      state.appError = {
        status: false,
        msg: ""
      }
    },
    updateStateModule: (state, action) => {
      state.modules = action.payload
    }
  }
})

export const {
  initAppData,
  initAppRoutes,
  handleAppLoading,
  showAppError,
  dismissAppError,
  updateStateModule
} = appSlice.actions

export default appSlice.reducer
