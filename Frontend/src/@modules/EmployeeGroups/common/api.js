import { axiosApi } from "@apps/utility/api"
import { serialize } from "@apps/utility/handleData"

export const employeeGroupApi = {
  async previewEmployee(condition) {
    return await axiosApi.post(
      "employee-groups/preview-employee",
      serialize(_.cloneDeep(condition))
    )
  },
  async editEmployeeGroup(id, data) {
    return await axiosApi.post(
      `employee-groups/edit-employee-group/${id}`,
      serialize(_.cloneDeep(data))
    )
  },
  async getGroupInfo(id) {
    return await axiosApi.get(`employee-groups/get-group-info/${id}`)
  }
}
