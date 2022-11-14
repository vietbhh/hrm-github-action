import { axiosApi } from "@apps/utility/api"
import { erpSelectToValues, object2QueryString } from "@apps/utility/handleData"

export const TimeOffScheduleApi = {
  async loadTimeOffSchedule(params) {
    const filterString = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get(
      `reports-time-off-schedule/load-time-off-schedule?${filterString}`
    )
  },
  async exportAttendance(params) {
    const filterString = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get(
      `reports-time-off-schedule/export-time-off-schedule?${filterString}`,
      {
        responseType: "blob"
      }
    )
  }
}
