import { axiosApi } from "@apps/utility/api"
import { serialize } from "@apps/utility/handleData"

export const settingMemberApi = {
  async getMetas() {
    return await axiosApi.get("/fri-net-setting-member/get-metas")
  },

  async postShowHideInfo(data) {
    return await axiosApi.post(
      "/fri-net-setting-member/show-hide-info",
      serialize(_.cloneDeep(data))
    )
  }
}

export const userApi = {
  async getUser(identity) {
    return await axiosApi.get("/fri-net-user/get-user/" + identity, {
      disableLoading: true
    })
  },

  async saveCoverImage(data) {
    return await axiosApi.post(
      "/fri-net-user/save-cover-image",
      serialize(_.cloneDeep(data)),
      {
        disableLoading: true
      }
    )
  },

  async saveAvatar(data) {
    return await axiosApi.post("/user/avatar", serialize(_.cloneDeep(data)), {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  }
}

export const introductionApi = {
  async getSettingMember() {
    return await axiosApi.get("/fri-net-introduction/get-setting-member")
  }
}
