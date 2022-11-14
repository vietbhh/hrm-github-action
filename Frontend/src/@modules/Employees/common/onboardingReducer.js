// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit"

export const onboardingSlide = createSlice({
  name: "onboarding",
  initialState: {
    modal: false,
    user: {}
  },
  reducers: {
    showOnboardingModal: (state, action) => {
      state.modal = true
      state.user = action.payload
    },
    hideOnboardingModal: (state, action) => {
      state.modal = false
      state.user = {}
    }
  }
})

export const { showOnboardingModal, hideOnboardingModal } =
  onboardingSlide.actions

export default onboardingSlide.reducer
