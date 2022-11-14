import { axiosApi } from "@apps/utility/api"
import { serialize } from "@apps/utility/handleData"

export const contractTypeApi = {
  async createContractType(data) {
    return await axiosApi.post(
      "/contract-type/create-contract-type",
      serialize(_.cloneDeep(data))
    )
  },
  async loadContractType() {
    return await axiosApi.get("contract-type/load-contract-type")
  },
  async updateContractType(id, data) {
    return await axiosApi.post(
      `/contract-type/update-contract-type/${id}`,
      serialize(_.cloneDeep(data))
    )
  },
  async deleteContractType(id) {
    return await axiosApi.post(`/contract-type/delete-contract-type/${id}`)
  }
}
