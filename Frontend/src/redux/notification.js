// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    listNotification: [],
    numberNotification: 0
  },
  reducers: {
    handleNotification: (state, action) => {
      const { listNotification, numberNotification } = action.payload
      state.listNotification = listNotification
      state.numberNotification = numberNotification
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
    }
  }
})

export const { handleNotification, handleSeenNotification } =
  notificationSlice.actions

export default notificationSlice.reducer
