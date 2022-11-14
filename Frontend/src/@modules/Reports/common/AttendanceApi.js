import { axiosApi } from "@apps/utility/api"
import { erpSelectToValues, object2QueryString } from "@apps/utility/handleData"

export const AttendanceApi = {
  async loadAttendance(params) {
    const filterString = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get(
      `reports-attendance/load-attendance?${filterString}`
    )
  },
  async exportAttendance(params) {
    const filterString = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get(
      `reports-attendance/export-attendance?${filterString}`,
      {
        responseType: "blob"
      }
    )
  }
}
