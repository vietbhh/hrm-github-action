// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit"

const driveSlice = createSlice({
  name: "drive",
  initialState: {
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
    reloadPage: false
  },
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
    }
  }
})

export const {
  openModalUpload,
  closeModalUpload,
  toggleModalNewFolder,
  setListFolder,
  setFilter,
  setReloadPage
} = driveSlice.actions

export default driveSlice.reducer
