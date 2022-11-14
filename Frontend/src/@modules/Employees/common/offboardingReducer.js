// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit"

export const offboardingSlice = createSlice({
  name: "offboarding",
  initialState: {
    modal: false,
    user: {},
    subordinates: []
  },
  reducers: {
    showOffboardingModal: (state, action) => {
      state.modal = true
      state.user = action.payload
      state.subordinates = []
    },
    hideOffboardingModal: (state, action) => {
      state.modal = false
      state.subordinates = []
    },
    removeEmployeeOffBoarding: (state, action) => {
      state.user = {}
    }
  }
})

export const {
  showOffboardingModal,
  hideOffboardingModal,
  removeEmployeeOffBoarding
} = offboardingSlice.actions

export default offboardingSlice.reducer
