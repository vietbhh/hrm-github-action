import { axiosApi, axiosNodeApi } from "@apps/utility/api"
import { serialize } from "@apps/utility/handleData"

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
  },

  async postDeleteChatMessage(data) {
    return await axiosApi.post(
      "/chat/delete-message",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  }
}

export const testApi = {
  async postCreateGroup(data) {
    return await axiosNodeApi.post("/chat/create-group", data)
  },

  async postAddGroupMember(data) {
    return await axiosNodeApi.post("/chat/add-group-member", data)
  },

  async postRemoveGroupMember(data) {
    return await axiosNodeApi.post("/chat/remove-group-member", data)
  },

  async postDeleteGroup(data) {
    return await axiosNodeApi.post("/chat/delete-group", data)
  },

  async postSendMessageGroup(data) {
    return await axiosNodeApi.post("/chat/send-message-group", data)
  }
}
