import { formatDateToMonthShort } from "@utils"
import moment from "moment"

export const formatTime = (time) => {
  const today = moment().format("YYYY-MM-DD")
  const day = moment(time).format("YYYY-MM-DD")
  if (today === day) {
    return moment(time).format("HH:mm")
  } else {
    return formatDateToMonthShort(time)
  }
}
