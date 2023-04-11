import { axiosNodeApi, axiosApi } from "@apps/utility/api"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import { object2QueryString, serialize } from "@apps/utility/handleData"
import { downloadApi } from "@apps/modules/download/common/api"

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
  },
  async getList(params) {
    const strParams = object2QueryString(params)
    return await axiosNodeApi.get(`/workspace/list?get${strParams}`)
  },
  async update(id, data) {
    return await axiosNodeApi.post(
      `/workspace/update/${id}`,
      serialize(_.cloneDeep(data))
    )
  },
  async getDetail(workspaceId) {
    return await axiosNodeApi.get(`/workspace/${workspaceId}`)
  },
  async sortGroupRule(id, data) {
    return await axiosNodeApi.post(`/workspace/sort-group-rule/${id}`, data, {
      disableLoading: true
    })
  },
  async loadDataMember(id, params) {
    const strParams = object2QueryString(params)
    return await axiosNodeApi.get(
      `/workspace/load-data-member/${id}?get${strParams}`,
      {
        disableLoading: true
      }
    )
  },
  async loadMedia(id, params) {
    const strParams = object2QueryString(params)
    return await axiosNodeApi.get(
      `/workspace/load-data-media/${id}?get${strParams}`,
      {
        disableLoading: true
      }
    )
  },
  async loadGCSObjectLink(params) {
    const strParams = object2QueryString(params)
    return await axiosNodeApi.get(
      `/workspace/load-gcs-object-link?get${strParams}`,
      {
        disableLoading: true
      }
    )
  },
  async loadPost(params) {
    const strParams = object2QueryString(params)
    return await axiosNodeApi.get(`/workspace/pending-posts?${strParams}`)
  },

  async approvePost(data) {
    return await axiosNodeApi.post(`/workspace/approvePost`, data)
  },
  async loadFeed(params) {
    const strParams = object2QueryString(params)
    return await axiosNodeApi.get(`/workspace/load-feed?${strParams}`)
  },
  async addMemberByDepartment(data) {
    return await axiosNodeApi.post(
      `/workspace/add-member`,
      serialize(_.cloneDeep(data))
    )
  },
  async loadMember(params) {
    const strParams = object2QueryString(params)
    return await axiosApi.get(`/employees/in-department?${strParams}`)
  },
  async loadPinned(params) {
    const strParams = object2QueryString(params)
    return await axiosNodeApi.get(`/workspace/load-pinned?${strParams}`)
  },
  async downloadMedia(src, downloadFromStorage = false) {
    return await downloadApi.getFile(src, downloadFromStorage)
  },

  async removeCover(Id) {
    return await axiosNodeApi.post(`/workspace/remove-cover-image/` + Id)
  }
}
