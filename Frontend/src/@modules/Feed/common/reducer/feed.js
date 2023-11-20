// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit"

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    feedState: {}, // ** {dataPost: array, hasMore: boolean, page: int, totalPost: int}
    workspaceState: {} // **  {workspaceID: {dataPost: array, hasMore: boolean, page: int, totalPost: int}}
  },
  reducers: {
    setFeedState: (state, action) => {
      const payload = action.payload

      if (payload.type === "init") {
        state.feedState = payload.data
      } else if (payload.type === "update") {
        const data = state.feedState.dataPost
        if (
          data.some((itemSome) => itemSome._id === payload.data.dataPost._id)
        ) {
          const newData = data.map((item) => {
            if (item._id === payload.data.dataPost._id) {
              return { ...payload.data.dataPost }
            }

            return item
          })

          state.feedState.dataPost = newData
        }
      } else if (payload.type === "update_state") {
        state.feedState = {
          ...state.feedState,
          ...payload.data
        }
      }
    },
    handleDataPostState: (state, action) => {
      const payload = action.payload
      if (payload.type === "push") {
        const newData = [action.payload.dataPost, ...state.feedState.dataPost]
        state.feedState = {
          ...state.feedState,
          dataPost: newData
        }
      } else if (payload.type === "remove") {
        const newData = [...state.feedState.dataPost].filter((item, index) => {
          return index !== payload.index
        })

        state.feedState = {
          ...state.feedState,
          dataPost: newData
        }
      } else if (payload.type === "update") {
        const newData = [...state.feedState.dataPost].map((item, index) => {
          if (item._id === payload.dataPost._id) {
            return {
              ...payload.dataPost
            }
          }

          return item
        })

        state.feedState = {
          ...state.feedState,
          dataPost: newData
        }
      }
    },
    handleNewDataFeedState: (state, action) => {
      const payload = action.payload
      if (payload.type === "push") {
        const newData = [action.payload.dataPost, ...state.feedState.newPosts]
        state.feedState = {
          ...state.feedState,
          newPosts: newData
        }
      } else if (payload.type === "remove") {
        const newData = [...state.feedState.newPosts].filter((item, index) => {
          return index !== payload.index
        })

        state.feedState = {
          ...state.feedState,
          newPosts: newData
        }
      } else if (payload.type === "update") {
        const newData = [...state.feedState.newPosts].map((item, index) => {
          if (item._id === payload.dataPost._id) {
            return {
              ...payload.dataPost
            }
          }

          return item
        })

        state.feedState = {
          ...state.feedState,
          newPosts: newData
        }
      }
    },
    appendDataFeedState: (state, action) => {
      state.feedState.dataPost = [
        ...state.feedState.dataPost,
        ...action.payload.dataPost
      ]
      state.feedState.hasMore = action.payload.hasMore
      state.feedState.page = action.payload.page
    },
    setWorkspaceState: (state, action) => {
      const payload = action.payload
      const workspaceId = payload.workspaceId

      if (payload.type === "init") {
        state.workspaceState[workspaceId] = payload.data
      } else if (payload.type === "update") {
        const data = state.workspaceState[workspaceId]["dataPost"]
        if (
          data.some((itemSome) => itemSome._id === payload.data.dataPost._id)
        ) {
          const newData = data.map((item) => {
            if (item._id === payload.data.dataPost._id) {
              return { ...payload.data.dataPost }
            }

            return item
          })

          state.workspaceState[workspaceId]["dataPost"] = newData
        }
      } else if (payload.type === "update_state") {
        state.workspaceState[workspaceId] = {
          ...state.workspaceState[workspaceId],
          ...payload.data
        }
      }
    },
    handleDataPostWorkspaceState: (state, action) => {
      const payload = action.payload
      const workspaceId = payload.workspaceId
      if (state.workspaceState[workspaceId] !== undefined) {
        if (payload.type === "push") {
          const newData = [
            action.payload.dataPost,
            ...state.workspaceState[workspaceId]["dataPost"]
          ]

          state.workspaceState[workspaceId] = {
            ...state.workspaceState[workspaceId],
            dataPost: newData
          }
        } else if (payload.type === "remove") {
          const newData = [
            ...state.workspaceState[workspaceId]["dataPost"]
          ].filter((item, index) => {
            return index !== payload.index
          })

          state.workspaceState[workspaceId] = {
            ...state.workspaceState[workspaceId],
            dataPost: newData
          }
        } else if (payload.type === "update") {
          const newData = [
            ...state.workspaceState[workspaceId]["dataPost"]
          ].map((item, index) => {
            if (item._id === payload.dataPost._id) {
              return {
                ...payload.dataPost
              }
            }

            return item
          })

          state.workspaceState[workspaceId] = {
            ...state.workspaceState[workspaceId],
            dataPost: newData
          }
        }
      }
    },
    handleNewDataWorkspaceState: (state, action) => {
      const payload = action.payload
      const workspaceId = payload.workspaceId
      if (state.workspaceState[workspaceId] !== undefined) {
        if (payload.type === "push") {
          const newData = [
            action.payload.dataPost,
            ...state.workspaceState[workspaceId]["newPosts"]
          ]

          state.workspaceState[workspaceId] = {
            ...state.workspaceState[workspaceId],
            newPosts: newData
          }
        } else if (payload.type === "remove") {
          const newData = [
            ...state.workspaceState[workspaceId]["newPosts"]
          ].filter((item, index) => {
            return index !== payload.index
          })

          state.workspaceState[workspaceId] = {
            ...state.workspaceState[workspaceId],
            newPosts: newData
          }
        } else if (payload.type === "update") {
          const newData = [
            ...state.workspaceState[workspaceId]["newPosts"]
          ].map((item, index) => {
            if (item._id === payload.dataPost._id) {
              return {
                ...payload.dataPost
              }
            }

            return item
          })

          state.workspaceState[workspaceId] = {
            ...state.workspaceState[workspaceId],
            newPosts: newData
          }
        }
      }
    },
    appendDataWorkspaceState: (state, action) => {
      const payload = action.payload
      const workspaceId = payload.workspaceId

      if (state.workspaceState[workspaceId] !== undefined) {
        const newData = [
          ...state.workspaceState[workspaceId]["dataPost"],
          ...action.payload.dataPost
        ]

        state.workspaceState[workspaceId]["dataPost"] = newData
        state.workspaceState[workspaceId]["hasMore"] = action.payload.hasMore
        state.workspaceState[workspaceId]["page"] = action.payload.page
      }
    }
  }
})

export const {
  setFeedState,
  handleDataPostState,
  handleNewDataFeedState,
  appendDataFeedState,
  setWorkspaceState,
  handleDataPostWorkspaceState,
  handleNewDataWorkspaceState,
  appendDataWorkspaceState
} = feedSlice.actions

export default feedSlice.reducer
