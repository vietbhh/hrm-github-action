import { axiosApi } from "@apps/utility/api"
import { serialize, object2QueryString } from "@apps/utility/handleData"
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
  async getCalendar(filter = {}) {
    let url = `/calendar/load`

    if (filter?.calendarTag !== undefined) {
      url += `?${filter.calendarTag
        .map((item, index) => `calendar_tag[${index}]=${item}`)
        .join("&")}`
    }

    delete filter["calendarTag"]
    const strParams = object2QueryString(filter)
    const sign = filter?.calendarTag !== undefined ? "&" : "?"
    url += `${sign}${strParams}`
    return await axiosApi.get(url)
  },
  async getCalendarTag() {
    return await axiosApi.get("calendar/load-calendar-tag")
  },
  async removeCalendar(id) {
    return await axiosApi.delete(`calendar/remove-calendar/${id}`)
  },
  async getListEvent(params = {}) {
    const strParams = object2QueryString(params)
    return await axiosApi.get(`calendar/get-list-event?${strParams}`)
  },
  async getDetailEvent(id) {
    return await axiosApi.get(`calendar/get-detail-event/${id}`)
  }
}
