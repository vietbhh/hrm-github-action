import { axiosApi } from "@apps/utility/api"
import {
  erpSelectToValues,
  object2QueryString,
  serialize
} from "@apps/utility/handleData"

export const ChatApi = {
  async getEmployees() {
    return await axiosApi.get("/chat/get-employees")
  },

  async postUpFile(data) {
    return await axiosApi.post(
      "/chat/post-up-file",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },

  async postUpBackground(data) {
    return await axiosApi.post(
      "/chat/post-up-background",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },

  async postUpAvatar(data) {
    return await axiosApi.post(
      "/chat/post-up-avatar",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  }
}
