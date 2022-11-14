import { axiosApi } from "@apps/utility/api"
import { erpSelectToValues, object2QueryString } from "@apps/utility/handleData"

export const TimeOffBalanceApi = {
  async loadTimeOffBalance(params) {
    const filterString = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get(
      `reports-time-off-balance/load-time-off-balance?${filterString}`
    )
  },
  async exportTimeOffBalance(params) {
    const filterString = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get(
      `reports-time-off-balance/export-time-off-balance?${filterString}`,
      {
        responseType: "blob"
      }
    )
  }
}
