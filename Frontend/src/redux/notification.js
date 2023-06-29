// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    listNotification: [],
    numberNotification: 0,
    openDropdown: false,
    focusNotification: false
  },
  reducers: {
    handleNotification: (state, action) => {
      const { listNotification, numberNotification } = action.payload
      state.listNotification = listNotification
      state.numberNotification = numberNotification !== undefined ? numberNotification : state.numberNotification
    },
    handleAppendNotification: (state, action) => {
      state.numberNotification = state.numberNotification + 1
      state.listNotification = [action.payload, ...state.listNotification]
    },
    handleSeenNotification: (state, action) => {
      const { listNotificationSeen, numberNotificationSeen } = action.payload
      const newListNotification = [...state.listNotification].map((item) => {
        if (listNotificationSeen.includes(item.id.toString())) item.seen = true
        return item
      })
      const newNumberNotification =
        state.numberNotification - numberNotificationSeen
      state.listNotification = newListNotification
      state.numberNotification = newNumberNotification
    },
    toggleOpenDropdown: (state, action) => {
      state.openDropdown =
        action.payload !== undefined ? action.payload : !state.openDropdown
    }
  }
})

export const {
  handleNotification,
  handleSeenNotification,
  handleAppendNotification,
  toggleOpenDropdown
} = notificationSlice.actions

export default notificationSlice.reducer
