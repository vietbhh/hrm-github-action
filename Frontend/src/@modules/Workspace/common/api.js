import { axiosNodeApi } from "@apps/utility/api"
import { serialize } from "@apps/utility/handleData"

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
  }
}
