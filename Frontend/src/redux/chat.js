// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit"

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    titleChat: "",
    unseen: 0
  },
  reducers: {
    handleChats: (state, action) => {
      const { chats } = action.payload
      state.chats = chats
    },
    handleTitleChat: (state, action) => {
      state.titleChat = action.payload
    },
    handleUnseen: (state, action) => {
      state.unseen = action.payload
    }
  }
})

export const { handleChats, handleTitleChat, handleUnseen } = chatSlice.actions

export default chatSlice.reducer
