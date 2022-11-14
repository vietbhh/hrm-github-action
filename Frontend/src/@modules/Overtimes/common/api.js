import { axiosApi } from "@apps/utility/api"
import { serialize, object2QueryString } from "@apps/utility/handleData"

export const overtimeApi = {
  async createOvertime(data) {
    return await axiosApi.post(
      "/overtimes/create-overtime",
      serialize(_.cloneDeep(data))
    )
  },
  async getOvertime(params) {
    const strString = object2QueryString(params)
    return await axiosApi.get(`/overtimes/get-overtime?${strString}`)
  },
  async actionOvertime(id, data) {
    return await axiosApi.post(
      `/overtimes/action-overtime/${id}`,
      serialize(_.cloneDeep(data))
    )
  },
  async getOvertimeRequest(params) {
    const strString = object2QueryString(params)
    return await axiosApi.get(`/overtimes/get-overtime-request?${strString}`)
  },
  async updateOvertime(id, data) {
    return await axiosApi.post(
      `/overtimes/update-overtime/${id}`,
      serialize(_.cloneDeep(data))
    )
  }
}
