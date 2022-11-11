// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit"

const calendarSlice = createSlice({
  name: "calendar",
  initialState: {
    viewOnly: false,
    modal: false,
    currentCalendar: {}
  },
  reducers: {
    showAddEventCalendarModal: (state, action) => {
      state.currentCalendar = action.payload.calendarInfo
      state.viewOnly = action.payload.viewOnly
      state.modal = true
    },
    hideAddEventCalendarModal: (state) => {
      state.modal = false
    },
    removeCurrentCalendar: (state) => {
      state.currentCalendar = {}
    }
  }
})

export const {
  showAddEventCalendarModal,
  hideAddEventCalendarModal,
  removeCurrentCalendar
} = calendarSlice.actions

export default calendarSlice.reducer
