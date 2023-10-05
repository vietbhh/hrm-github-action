// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit"

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    dataPostState: []
  },
  reducers: {
    setDataPost: (state, action) => {
      state.dataPostState = action.payload
    },
    appendDataPost: (state, action) => {
      state.dataPostState = [...state.dataPostState, ...action.payload]
    }
  }
})

export const { setDataPost, appendDataPost } = feedSlice.actions

export default feedSlice.reducer
