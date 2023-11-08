import { axiosApi } from "@apps/utility/api"

export const notificationApi = {
  async loadCalendar(params) {
    return await axiosApi.get(
      `/notification/load?page=${params.page}&per_page=20`
    )
  },
  async readNotification(id) {
    return await axiosApi.post(`/notification/read/${id}`)
  },
  async removeNotification(id) {
    return await axiosApi.post(`/notification/remove/${id}`)
  }
}
