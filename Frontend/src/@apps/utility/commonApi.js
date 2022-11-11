import { axiosApi } from "@apps/utility/api"
import { serialize } from "./handleData"
export const commonApi = {
  async getMailTemplates(condition = {}, returnAsOption = false) {
    const option = returnAsOption ? "/true" : ""
    return await axiosApi.get(`/settings/mail/templates${option}`, {
      params: condition
    })
  },
  async addOptionSelect(module, data) {
    return await axiosApi.post(
      "/module/" + module + "/create-option",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async uploadLibs(data) {
    return await axiosApi.post("/lib/upload", serialize(_.cloneDeep({ data })))
  }
}
