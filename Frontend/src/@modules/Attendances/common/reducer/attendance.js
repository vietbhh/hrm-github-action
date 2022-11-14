// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit"

const attendanceSlice = createSlice({
  name: "overtimeAttendance",
  initialState: {
    modalPaidTime: false,
    modalOvertime: false,
    currentAttendanceDetailDataUpdate: {},
    canRunTimer: false,
    hours: 0,
    minutes: 0,
    seconds: 0,
    workSchedule: {}
  },
  reducers: {
    showEditOvertimeAttendanceModal: (state) => {
      state.modalOvertime = true
    },
    hideEditOvertimeAttendanceModal: (state) => {
      state.modalOvertime = false
    },
    showEditPaidTimeAttendanceModal: (state) => {
      state.modalPaidTime = true
    },
    hideEditPaidTimeAttendanceModal: (state) => {
      state.modalPaidTime = false
    },
    setCurrentAttendanceDetailDataUpdate: (state, action) => {
      state.currentAttendanceDetailDataUpdate = action.payload
    },
    setCanRunTimer: (state, action) => {
      state.canRunTimer = action.payload
    },
    setHours: (state, action) => {
      state.hours = action.payload
    },
    setMinutes: (state, action) => {
      state.minutes = action.payload
    },
    setSeconds: (state, action) => {
      state.seconds = action.payload
    },
    increaseSeconds: (state) => {
      state.seconds = state.seconds + 1
    },
    setWorkSchedule: (state, action) => {
      state.workSchedule = action.payload
    }
  }
})

export const {
  showEditOvertimeAttendanceModal,
  hideEditOvertimeAttendanceModal,
  showEditPaidTimeAttendanceModal,
  hideEditPaidTimeAttendanceModal,
  setCurrentAttendanceDetailDataUpdate,
  setCanRunTimer,
  setHours,
  setMinutes,
  setSeconds,
  increaseSeconds,
  setWorkSchedule
} = attendanceSlice.actions

export default attendanceSlice.reducer
