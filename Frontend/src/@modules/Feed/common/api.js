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

  async getLoadFeedProfile(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosNodeApi.get("/feed/load-feed-profile?" + stringFilters, {
      disableLoading: true
    })
  },

  async getGetFeedChild(id) {
    return await axiosNodeApi.get("/feed/get-feed-child/" + id)
  },

  async getGetFeed(id) {
    return await axiosNodeApi.get("/feed/get-feed/" + id + "?" + stringFilters)
  },

  async getPostDetailDashboard(id, params) {
    const strFilter = object2QueryString(params)

    return await axiosNodeApi.get("")
  },

  async getGetFeedAndComment(id) {
    return await axiosNodeApi.get("/feed/get-feed-and-comment/" + id)
  },

  async postUpdatePost(data) {
    return await axiosNodeApi.post("/feed/update-post", data)
  },

  async postUpdatePostPollVote(data) {
    return await axiosNodeApi.post("/feed/update-post-poll-vote", data)
  },

  async postUpdatePostPollVoteAddMoreOption(data) {
    return await axiosNodeApi.post(
      "/feed/update-post-poll-vote-add-more-option",
      data
    )
  },

  async postUpdateContentMedia(data) {
    return await axiosNodeApi.post("/feed/update-content-media", data)
  },

  async postDeletePost(data) {
    return await axiosNodeApi.post("/feed/delete-post", data)
  },

  async postUpdateComment(data) {
    return await axiosNodeApi.post("/feed/update-comment", data)
  },

  async postUpdateSubComment(data) {
    return await axiosNodeApi.post("/feed/update-sub-comment", data)
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
  },

  async postSubmitCommentReply(data) {
    return await axiosNodeApi.post(
      "/feed/submit-comment-reply",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },

  async postDeleteComment(data) {
    return await axiosNodeApi.post("/feed/delete-comment", data)
  }
}
