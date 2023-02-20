import { axiosNodeApi } from "@apps/utility/api"
import { object2QueryString, serialize } from "@apps/utility/handleData"

export const workspaceApi = {
  async save(data) {
    return await axiosNodeApi.post(
      "/workspace/save",
      serialize(_.cloneDeep(data))
    )
  },
  async getList(params) {
    const strParams = object2QueryString(params)
    return await axiosNodeApi.get(`/workspace/list?get${strParams}`)
  }
}
