// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit"

export const appSlice = createSlice({
  name: "users",
  initialState: {
    list: {},
    online: []
  },
  reducers: {
    updateOnlineUsers: (state, action) => {
      state.online = action.payload
    },
    updateListUsers: (state, action) => {
      state.list = action.payload
    }
  }
})

export const { updateOnlineUsers, updateListUsers } = appSlice.actions

export default appSlice.reducer
