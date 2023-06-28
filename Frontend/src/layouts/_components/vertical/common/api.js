import { axiosApi } from "@apps/utility/api"
import {
  erpSelectToValues,
  object2QueryString,
  serialize
} from "@apps/utility/handleData"

export const HeaderAssistantApi = {
  async getHeaderAssistant() {
    return await axiosApi.get("/header-assistant/get-header-assistant", {
      disableLoading: true
    })
  },

  async getWeather() {
    return await axiosApi.get("/header-assistant/get-weather", {
      disableLoading: true
    })
  },

  async getAllHeaderAssistant() {
    return await axiosApi.get("/header-assistant/get-all-header-assistant")
  },

  async getDeleteHeaderAssistant(id) {
    return await axiosApi.get(
      "/header-assistant/get-delete-header-assistant/" + id
    )
  },

  async getDataHeaderAssistant(id) {
    return await axiosApi.get(
      "/header-assistant/get-data-header-assistant/" + id
    )
  },

  async postSaveHeaderAssistant(data) {
    return await axiosApi.post(
      "/header-assistant/save-header-assistant",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  }
}
