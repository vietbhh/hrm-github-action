import { axiosNodeApi } from "@apps/utility/api"
import { object2QueryString, serialize } from "@apps/utility/handleData"

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
  async getList(params) {
    const strParams = object2QueryString(params)
    return await axiosNodeApi.get(`/workspace/list?get${strParams}`)
  },
  async update(id, data) {
    return await axiosNodeApi.post(`/workspace/update/${id}`, data)
  },
  async getDetail(workspaceId) {
    return await axiosNodeApi.get(`/workspace/${workspaceId}`)
  },
  async sortGroupRule(id, data) {
    return await axiosNodeApi.post(`/workspace/sort-group-rule/${id}`, data, {
      disableLoading: true
    })
  }
}
