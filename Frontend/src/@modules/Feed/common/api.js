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

  async postSubmitPost(data) {
    return await axiosNodeApi.post("/feed/submit-post", data)
  },

  async getLoadFeed(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosNodeApi.get("/feed/load-feed?" + stringFilters, {
      disableLoading: true
    })
  },

  async getGetFeedChild(id) {
    return await axiosNodeApi.get("/feed/get-feed-child/" + id)
  },

  async getGetFeed(id) {
    return await axiosNodeApi.get("/feed/get-feed/" + id)
  },

  async getGetFeedAndComment(id) {
    return await axiosNodeApi.get("/feed/get-feed-and-comment/" + id)
  },

  async postUpdatePost(data) {
    return await axiosNodeApi.post("/feed/update-post", data)
  },

  async postUpdateComment(data) {
    return await axiosNodeApi.post("/feed/update-comment", data)
  },

  async postSubmitComment(data) {
    return await axiosNodeApi.post(
      "/feed/submit-comment",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  }
}
