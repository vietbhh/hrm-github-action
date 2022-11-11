import { axiosApi } from "@apps/utility/api"
import { serialize } from "@apps/utility/handleData"

export const notificationApi = {
  async loadCalendar(params) {
    return await axiosApi.get(`notification/load?page=${params.page}&per_page=20`)
  }
}
