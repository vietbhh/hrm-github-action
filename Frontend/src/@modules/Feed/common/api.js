import { axiosNodeApi } from "@apps/utility/api"
import {
  erpSelectToValues,
  object2QueryString,
  serialize
} from "@apps/utility/handleData"

export const feedApi = {
  async postUploadAttachment(data) {
    return await axiosNodeApi.post(
      "/feed/upload-temp-attachment",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },

  async getGetAllEmployeeActive() {
    return await axiosNodeApi.get("/feed/get-all-employee-active")
  },

  async postSubmitPost(data) {
    return await axiosNodeApi.post(
      "/feed/submit-post",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },

  async getLoadFeed(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosNodeApi.get("/feed/load-feed?" + stringFilters, {
      disableLoading: true
    })
  },

  async getGetUserPost(id) {
    return await axiosNodeApi.get("/feed/get-user-post/" + id)
  },

  async getGetFeedChild(id) {
    return await axiosNodeApi.get("/feed/get-feed-child/" + id)
  },

  async getGetFeed(id) {
    return await axiosNodeApi.get("/feed/get-feed/" + id)
  }
}
