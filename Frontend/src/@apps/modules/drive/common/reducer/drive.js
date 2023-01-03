// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  modalUpload: false,
  modalUploadType: false,
  modalNewFolder: false,
  modalDataNewFolder: {},
  listFolder: [],
  filter: {
    sort: {
      label: "due_date",
      value: "created_at"
    },
    layout: "list" // [list, grid]
  },
  reloadPage: false,
  isUploadingFileAndFolder: false,
  listUploadingFile: {},
  showUploadNotification: false,
  axiosTokenSource: {},
  recentFileAndFolder: {},
  modalShare: false,
  modalDataShare: {}
}

const driveSlice = createSlice({
  name: "drive",
  initialState: initialState,
  reducers: {
    openModalUpload: (state, action) => {
      state.modalUploadType = action.payload
      state.modalUpload = true
    },
    closeModalUpload: (state) => {
      state.modalUpload = false
    },
    toggleModalNewFolder: (state) => {
      state.modalNewFolder = !state.modalNewFolder
    },
    setModalDataNewFolder: (state, action) => {
      state.modalDataNewFolder = action.payload
    },
    setListFolder: (state, action) => {
      state.listFolder = action.payload
    },
    setFilter: (state, action) => {
      state.filter = action.payload
    },
    setReloadPage: (state, action) => {
      state.reloadPage = action.payload
    },
    setIsUploadingFileAndFolder: (state, action) => {
      state.isUploadingFileAndFolder = action.payload
    },
    setListUploadingFile: (state, action) => {
      state.listUploadingFile = {
        ...state.listUploadingFile,
        [action.payload.uid]: { ...action.payload }
      }
    },
    updateUploadingProgress: (state, action) => {
      state.listUploadingFile[action.payload.uid] = { ...action.payload }
    },
    setShowUploadNotification: (state, action) => {
      state.showUploadNotification = action.payload
    },
    setAxiosTokenSource: (state, action) => {
      state.axiosTokenSource = {
        ...state.axiosTokenSource,
        [action.payload.uid]: { ...action.payload }
      }
    },
    resetDriveState: (state, action) => {
      const listKey = _.isArray(action.payload)
        ? action.payload
        : [action.payload]

      listKey.map((item) => {
        state[item] = initialState[item]
      })
    },
    setRecentFileAndFolder: (state, action) => {
      if (action.payload.pushType === "new") {
        state.recentFileAndFolder = action.payload.data
      } else if (action.payload.pushType === "update") {
        const payload = action.payload
        state.recentFileAndFolder = {
          ...state.recentFileAndFolder,
          [payload.key]: payload.data
        }
      }
    },
    toggleModalShare: (state) => {
      state.modalShare = !state.modalShare
    },
    setModalDataShare: (state, action) => {
      state.modalDataShare = action.payload
    }
  }
})

export const {
  openModalUpload,
  closeModalUpload,
  toggleModalNewFolder,
  setListFolder,
  setFilter,
  setReloadPage,
  setIsUploadingFileAndFolder,
  setListUploadingFile,
  updateUploadingProgress,
  setShowUploadNotification,
  setAxiosTokenSource,
  resetDriveState,
  setRecentFileAndFolder,
  toggleModalShare,
  setModalDataShare
} = driveSlice.actions

export default driveSlice.reducer
