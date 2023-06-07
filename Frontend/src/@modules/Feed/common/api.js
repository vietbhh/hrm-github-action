import { axiosApi, axiosNodeApi } from "@apps/utility/api"
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
    return await axiosNodeApi.get("/feed/get-feed/" + id)
  },

  async getPostDetailDashboard(id, params) {
    const strFilter = object2QueryString(params)

    return await axiosNodeApi.get("")
  },

  async getGetFeedAndComment(id) {
    return await axiosNodeApi.get("/feed/get-feed-and-comment/" + id)
  },

  async postUpdatePostReaction(data) {
    return await axiosNodeApi.post("/feed/update-post-reaction", data)
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

  async postUpdateCommentReaction(data) {
    return await axiosNodeApi.post("/feed/update-comment-reaction", data)
  },

  async postUpdateSubCommentReaction(data) {
    return await axiosNodeApi.post("/feed/update-sub-comment-reaction", data)
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
  },

  async getGetInitialEvent() {
    return await axiosApi.get("/feed/get-initial-event")
  },

  async getUpdateSeenPost(post_id) {
    return await axiosNodeApi.get("/feed/update-seen-post/" + post_id, {
      disableLoading: true
    })
  },

  async getSendNotiUnseen(post_id) {
    return await axiosNodeApi.get("/feed/send-noti-unseen/" + post_id, {
      disableLoading: true
    })
  }
}

export const eventApi = {
  async postSubmitEvent(data) {
    return await axiosNodeApi.post(
      "/feed/submit-event",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },

  async postUpdateEventStatus(data) {
    return await axiosNodeApi.post("/feed/update-event-status", data)
  },

  async getGetEventById(id) {
    return await axiosNodeApi.get("/feed/get-event-by-id/" + id)
  }
}

export const announcementApi = {
  async postSubmitAnnouncement(data) {
    return await axiosNodeApi.post(
      "/feed/submit-announcement",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },

  async getAnnouncementById(id) {
    return await axiosNodeApi.get("/feed/get-announcement-by-id/" + id)
  }
}

export const endorsementApi = {
  async postSubmitEndorsement(data) {
    return await axiosNodeApi.post(
      "/feed/submit-endorsement",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },

  async getEndorsementById(id) {
    return await axiosNodeApi.get("/feed/get-endorsement-by-id/" + id)
  }
}

export const hashtagApi = {
  async getGetDataHashtag(hashtag) {
    return await axiosNodeApi.get("/feed/get-data-hashtag/" + hashtag)
  },

  async getLoadFeedHashtag(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosNodeApi.get(
      "/feed/get-load-feed-hashtag?" + stringFilters,
      {
        disableLoading: true
      }
    )
  }
}
