// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit"

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    titleChat: "",
    unseen: 0,
    typing: []
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
    },
    handleTyping: (state, action) => {
      state.typing = action.payload
    }
  }
})

export const { handleChats, handleTitleChat, handleUnseen, handleTyping } =
  chatSlice.actions

export default chatSlice.reducer
