// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit"

export const appSlice = createSlice({
  name: "users",
  initialState: {
    online: []
  },
  reducers: {
    updateOnlineUsers: (state, action) => {
      state.online = action.payload
    }
  }
})

export const { updateOnlineUsers } = appSlice.actions

export default appSlice.reducer
