import { formatDateToMonthShort } from "@utils"
import moment from "moment"

export const formatTime = (time, date_time = false) => {
  const today = moment().format("YYYY-MM-DD")
  const day = moment(time).format("YYYY-MM-DD")
  if (today === day) {
    return moment(time).format("HH:mm")
  } else {
    if (date_time === true) {
      return moment(time).format("HH:mm, DD/MM/YYYY")
    } else {
      return formatDateToMonthShort(time)
    }
  }
}

export const replaceTextMessage = (txt) => {
  const mapObj = {
    "<br>": " "
  }
  txt = txt.replace(/<br>/gi, function (matched) {
    return mapObj[matched]
  })

  return txt
}

export const triGram = (txt) => {
  txt = txt.slice(0, 500)
  txt = replaceTextMessage(txt)
  const map = {}
  const s1 = (txt || "").toLowerCase()
  const n = 3
  for (let k = 0; k <= s1.length - n; k++) map[s1.substring(k, k + n)] = true

  return map
}

export const highlightText = (text, textSearch) => {
  const index = text.indexOf(textSearch)
  if (index === -1) {
    return text
  }

  return (
    text.substring(0, index) +
    "<span class='highlight-text'>" +
    text.substring(index, index + textSearch.length) +
    "</span>" +
    text.substring(index + textSearch.length)
  )
}
