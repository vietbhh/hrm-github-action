import { axiosApi } from "@apps/utility/api"
import {
  erpSelectToValues,
  object2QueryString,
  serialize
} from "@apps/utility/handleData"

export const EmployeeAttendanceApi = {
  async getConfig() {
    return await axiosApi.get("/attendances-employee/get-config")
  },

  async getTableAttendance(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get(
      "/attendances-employee/get-table-attendance?" + stringFilters
    )
  },

  async postSaveEmployeeAttendance(data) {
    return await axiosApi.post(
      "/attendances-employee/post-save-employee-attendance",
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },

  async getExportExcel(params) {
    const stringFilters = object2QueryString(
      erpSelectToValues(_.cloneDeep(params))
    )
    return await axiosApi.get(
      "/attendances-employee/export-excel?" + stringFilters,
      {
        responseType: "blob"
      }
    )
  }
}
