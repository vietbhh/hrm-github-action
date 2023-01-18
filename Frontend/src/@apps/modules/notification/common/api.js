import { axiosApi } from "@apps/utility/api"

export const notificationApi = {
  async loadCalendar(params) {
    return await axiosApi.get(
      `/notification/load?page=${params.page}&per_page=20`
    )
  }
}
