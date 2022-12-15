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
      value: "due_date"
    },
    layout: "list" // [list, grid]
  },
  reloadPage: false,
  isUploadingFileAndFolder: false,
  listUploadingFile: {},
  showUploadNotification: false,
  axiosTokenSource: {}
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
  resetDriveState
} = driveSlice.actions

export default driveSlice.reducer
