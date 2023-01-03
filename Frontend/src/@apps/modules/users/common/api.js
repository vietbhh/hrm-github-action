import { axiosApi } from "@apps/utility/api"
import { serialize } from "@apps/utility/handleData"
export const userApi = {
  async getUser(identity) {
    return await axiosApi.get("/user/get/" + identity)
  },
  async getProfile() {
    return await axiosApi.get("/user/profile")
  },
  async postUpdate(data) {
    return await axiosApi.post("/user/update", serialize(_.cloneDeep(data)), {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  },
  async getDocuments(id) {
    return await axiosApi.get("/user/documents")
  },
  async postDocuments(data) {
    return await axiosApi.post(
      "/user/documents",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async deleteDocuments(fileName) {
    const pathUrl = "/user/documents/" + fileName
    return await axiosApi.delete(pathUrl)
  },

  async getRelatedList(relatedName, id) {
    return await axiosApi.get(`/user/related/${relatedName}`, {
      isPaginate: false
    })
  },
  async getRelatedDetail(relatedName, relateId) {
    return await axiosApi.get(`/user/related/${relatedName}/${relateId}`)
  },
  async saveRelated(relatedName, data) {
    return await axiosApi.post(
      `/user/related/${relatedName}`,
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async deleteRelated(relatedName, id, relateId) {
    const pathUrl = `/user/related/${relatedName}/${id}/${relateId}`
    return await axiosApi.delete(pathUrl)
  },

  async changeAvatar(data) {
    return await axiosApi.post("/user/avatar", serialize(_.cloneDeep(data)), {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  },
  async saveDeviceToken(data) {
    return await axiosApi.post(
      "/user/save-device-token",
      serialize(_.cloneDeep(data))
    )
  },
  removeDeviceToken() {
    const deviceToken = localStorage.getItem("deviceToken")
    return axiosApi.post(
      "/user/remove-device-token",
      serialize(
        _.cloneDeep({
          token: deviceToken
        })
      )
    )
  }
}
