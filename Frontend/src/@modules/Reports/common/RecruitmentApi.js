import { axiosApi } from "@apps/utility/api"
import { erpSelectToValues, object2QueryString } from "@apps/utility/handleData"

export const RecruitmentApi = {
  async loadRecruitment(params) {
    const filterString = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get(
      `reports-recruitment/load-recruitment?${filterString}`
    )
  },
  async exportRecruitment(params) {
    const filterString = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get(
      `reports-recruitment/export-recruitment?${filterString}`,
      {
        responseType: "blob"
      }
    )
  }
}
 