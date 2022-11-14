import { axiosApi } from "@apps/utility/api"
import { serialize } from "@apps/utility/handleData"
import axios from "axios"

export const calendarApi = {
  async addCalendar(data) {
    return await axiosApi.post("calendar/add", serialize(_.cloneDeep(data)), {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  },
  async updateCalendar(id, data) {
    return await axiosApi.post(
      `calendar/update/${id}`,
      serialize(_.cloneDeep(data)),
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
  },
  async getCalendar(filter) {
    const url = `/calendar/load?${filter.calendarTag
      .map((item, index) => `calendar_tag[${index}]=${item}`)
      .join("&")}`
    return await axiosApi.get(url)
  },
  async getCalendarTag() {
    return await axiosApi.get("calendar/load-calendar-tag")
  },
  async removeCalendar(id) {
    return await axiosApi.delete(`calendar/remove-calendar/${id}`)
  },
  async getEventDetail(id) {
    return await axiosApi.get(`calendar/get-event-detail/${id}`)
  }
}
