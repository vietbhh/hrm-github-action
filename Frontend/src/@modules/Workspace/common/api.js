import { axiosNodeApi } from "@apps/utility/api"
import { serialize } from "@apps/utility/handleData"
import { defaultModuleApi } from "@apps/utility/moduleApi"

export const workspaceApi = {
  async save(data) {
    return await axiosNodeApi.post(
      "/workspace/save",
      serialize(_.cloneDeep(data))
    )
  },
  async saveCoverImage(data) {
    return await axiosNodeApi.post(
      "/workspace/save-cover-image",
      serialize(_.cloneDeep(data))
    )
  },
  async getDetailWorkspace(Id) {
    return await axiosNodeApi.get("/workspace/" + Id)
  }
}
