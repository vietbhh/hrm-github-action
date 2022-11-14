import { axiosApi } from "@apps/utility/api"
import {
  erpSelectToValues,
  object2QueryString,
  serialize
} from "@apps/utility/handleData"

export const careersApi = {
  async getData(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get("/careers?" + stringFilters)
  },
  async getInfoBySlug(slug = "") {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep({ slug: slug }))
    )
    return await axiosApi.get("/careers/info?" + stringFilters)
  },
  async saveApply(data) {
    return await axiosApi.post(
      `/careers/apply`,
      serialize(_.cloneDeep({ data }))
    )
  }
}
