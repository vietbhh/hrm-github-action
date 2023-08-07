// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit"

const calendarSlice = createSlice({
  name: "calendar",
  initialState: {
    viewOnly: false,
    modal: false,
    idEvent: null,
    currentCalendar: {}
  },
  reducers: {
    showAddEventCalendarModal: (state, action) => {
      state.idEvent = action.payload.idEvent
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
