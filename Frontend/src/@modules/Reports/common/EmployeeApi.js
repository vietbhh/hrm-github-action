import { axiosApi } from "@apps/utility/api"
import { erpSelectToValues, object2QueryString } from "@apps/utility/handleData"

export const ReportEmployeeApi = {
  async getEmployee() {
    return await axiosApi.get("/reports-employee/get-employee")
  },

  async getEmployeeFilter(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get(
      "/reports-employee/employee-filter?" + stringFilters
    )
  }
}
