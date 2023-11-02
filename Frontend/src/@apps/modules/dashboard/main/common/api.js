import { axiosApi } from "@apps/utility/api"
import { axiosNodeApi } from "@apps/utility/api"
import {
  erpSelectToValues,
  object2QueryString,
  serialize
} from "@apps/utility/handleData"

export const DashboardApi = {
  async getDashboard() {
    return await axiosApi.get("/dashboard/get-dashboard")
  },

  async getUpdateLoadingDashboard() {
    return await axiosApi.get("/dashboard/update-loading-dashboard", {
      disableLoading: true
    })
  },

  async postSaveWidget(data) {
    return await axiosApi.post(
      "/dashboard/save-widget",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        disableLoading: true
      }
    )
  },

  async postSaveWidgetLock(data) {
    return await axiosApi.post(
      "/dashboard/save-widget-lock",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        disableLoading: true
      }
    )
  }
}

export const NotepadApi = {
  async postSaveNotepad(data) {
    return await axiosApi.post("/notepad/save", serialize(_.cloneDeep(data)), {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  },

  async getNotepadAll() {
    return await axiosApi.get("/notepad/get_all", {
      disableLoading: true
    })
  },

  async getNotepad($id) {
    return await axiosApi.get("/notepad/get/" + $id)
  },

  async getNotepadPin($id) {
    return await axiosApi.get("/notepad/pin/" + $id)
  },

  async getNotepadUnPin($id) {
    return await axiosApi.get("/notepad/un_pin/" + $id)
  },

  async getNotepadDelete($id) {
    return await axiosApi.get("/notepad/delete/" + $id)
  },

  async postDeleteMultiple(data) {
    return await axiosApi.post(
      "/notepad/delete_multiple",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  }
}

export const EventApi = {
  async getListEvent(){
    return await axiosNodeApi.get("/calendar/get-list-event");
  }
}
