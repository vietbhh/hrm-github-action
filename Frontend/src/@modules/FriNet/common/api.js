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
