import { axiosApi } from "@apps/utility/api"
import {
  erpSelectToValues,
  object2QueryString,
  serialize
} from "@apps/utility/handleData"

import { defaultModuleApi } from "@apps/utility/moduleApi"
export const workScheduleApi = {
  async save(data) {
    return await axiosApi.post(
      "/work-schedule/save",
      serialize(_.cloneDeep({ data }))
    )
  },
  async info(id) {
    return await axiosApi.get("/work-schedule/info/" + id)
  },

  async delete(id) {
    return await axiosApi.post(
      "/work-schedule/delete",
      serialize(_.cloneDeep({ id: id }))
    )
  },
  async getList(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get("/work-schedule/loaddata?" + stringFilters)
  },
  async changeActive(data) {
    return await defaultModuleApi.postSave("work_schedules", data)
  },
  async setDefault(data) {
    return await axiosApi.post(
      "/work-schedule/setdefault",
      serialize(_.cloneDeep({ data }))
    )
  }
}
