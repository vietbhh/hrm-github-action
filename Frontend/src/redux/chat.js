// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit"

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    lastTimeMessage: 0,
    unread: 0
  },
  reducers: {
    handleChats: (state, action) => {
      const { chats, lastTimeMessage } = action.payload
      state.chats = chats
      if (lastTimeMessage !== undefined) {
        state.lastTimeMessage = lastTimeMessage
      }
    },
    handleLastTimeMessage: (state, action) => {
      const { lastTimeMessage } = action.payload
      state.lastTimeMessage = lastTimeMessage
    },
    handleUnread: (state, action) => {
      const { unread } = action.payload
      state.unread = unread
    }
  }
})

export const { handleChats, handleLastTimeMessage, handleUnread } =
  chatSlice.actions

export default chatSlice.reducer
