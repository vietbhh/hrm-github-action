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

export const triGram = (txt) => {
  const map = {}
  const s1 = (txt || "").toLowerCase()
  const n = 3
  for (let k = 0; k <= s1.length - n; k++) map[s1.substring(k, k + n)] = true

  return map
}
