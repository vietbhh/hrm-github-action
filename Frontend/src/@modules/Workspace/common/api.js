import { axiosNodeApi } from "@apps/utility/api"
import { serialize } from "@apps/utility/handleData"

export const workspaceApi = {
  async save(data) {
    return await axiosNodeApi.post(
      "/workspace/save",
      serialize(_.cloneDeep(data))
    )
  }
}
