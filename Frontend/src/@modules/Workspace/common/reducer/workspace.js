// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit"

const workspaceSlice = createSlice({
  name: "workspace",
  initialState: {
    modalCreatePost: false
  },
  reducers: {
    showModalCreatePost: (state) => {
      state.modalCreatePost = true
    },
    hideModalCreatePost: (state) => {
      state.modalCreatePost = false
    },
    setModalCreatePost: (state, actions) => {
      state.modalCreatePost = actions.payload
    }
  }
})

export const {
  showModalCreatePost,
  hideModalCreatePost,
  setModalCreatePost
} = workspaceSlice.actions

export default workspaceSlice.reducer
