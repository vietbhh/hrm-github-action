// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit"

export const rehireSlide = createSlice({
  name: "rehire",
  initialState: {
    modal: false,
    user: {}
  },
  reducers: {
    showRehireModal: (state, action) => {
      state.modal = true
      state.user = action.payload
    },
    hideRehireModal: (state, action) => {
      state.modal = false
      state.user = {}
    }
  }
})

export const { showRehireModal, hideRehireModal } =
  rehireSlide.actions

export default rehireSlide.reducer
