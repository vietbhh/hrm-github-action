// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit"

const calendarSlice = createSlice({
  name: "calendar",
  initialState: {
    viewOnly: false,
    modal: false,
    idEvent: null,
    indexEvent: null,
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
    },
    showDetailEventModal: (state, action) => {
      state.idEvent = action.payload.idEvent
      state.indexEvent = action?.payload?.indexEvent === undefined ? state.indexEvent : action.payload.indexEvent
      state.viewOnly = action.payload.viewOnly
      state.modalDetail = true
    },
    hideDetailEventModal: (state, action) => {

      state.modalDetail =
        action?.payload?.modalDetail !== undefined
          ? action.payload.modalDetail
          : false
      state.idEvent = null
    }
  }
})

export const {
  showAddEventCalendarModal,
  hideAddEventCalendarModal,
  removeCurrentCalendar,
  showDetailEventModal,
  hideDetailEventModal
} = calendarSlice.actions

export default calendarSlice.reducer
