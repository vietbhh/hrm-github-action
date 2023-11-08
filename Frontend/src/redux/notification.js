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
      state.numberNotification =
        numberNotification !== undefined
          ? numberNotification
          : state.numberNotification
    },
    handleAppendNotification: (state, action) => {
      state.numberNotification = state.numberNotification + 1
      state.listNotification = [action.payload, ...state.listNotification]
    },
    handleSeenNotification: (state, action) => {
      const { listNotificationSeen, numberNotificationSeen } = action.payload
      if (numberNotificationSeen === 0) {
        return
      }

      const newListNotification = [...state.listNotification].map((item) => {
        const id = item.id === undefined ? item?._id : item.id.toString()
        if (listNotificationSeen.includes(id)) item.seen = true
        return item
      })
      const newNumberNotification =
        state.numberNotification - numberNotificationSeen
      state.listNotification = newListNotification
      state.numberNotification = newNumberNotification
    },
    handleReadNotification: (state, action) => {
      const { listNotificationRead, numberNotificationRead } = action.payload
      if (numberNotificationRead === 0) {
        return
      }

      const newListNotification = [...state.listNotification].map((item) => {
        const id = item.id === undefined ? item?._id : item.id.toString()
        if (listNotificationRead.includes(id)) item.read = true
        return item
      })
      const newNumberNotification =
        state.numberNotification - numberNotificationRead

      state.listNotification = newListNotification
      state.numberNotification = newNumberNotification
    },
    toggleOpenDropdown: (state, action) => {
      state.openDropdown =
        action.payload !== undefined ? action.payload : !state.openDropdown
    },
    handleRemoveNotification: (state, action) => {
      const payload = action.payload
      const data = payload.data
      const idField = payload.idField
      const newListNotification = [...state.listNotification].filter((item) => {
        return item[idField] !== data[idField]
      })

      state.listNotification = newListNotification
      state.numberNotification = state.numberNotification - 1
    }
  }
})

export const {
  handleNotification,
  handleSeenNotification,
  handleReadNotification,
  handleAppendNotification,
  toggleOpenDropdown,
  handleRemoveNotification
} = notificationSlice.actions

export default notificationSlice.reducer
