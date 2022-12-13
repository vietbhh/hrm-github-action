// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit"

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: []
  },
  reducers: {
    handleChats: (state, action) => {
      const { chats } = action.payload
      state.chats = chats
    }
  }
})

export const { handleChats } = chatSlice.actions

export default chatSlice.reducer
