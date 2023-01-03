import i18n from "@src/configs/i18n"
import FileSaver from "file-saver"
import { forEach, isEmpty } from "lodash"
import moment from "moment"
import React from "react"
import * as XLSX from "xlsx"
import { isUndefined } from "./handleData"
import notification from "./notification"
import SwAlert from "./SwAlert"
export const useFormatMessage = (
  messageId,
  value = {},
  defaultMessage = ""
) => {
  return i18n.t(messageId, {
    defaultValue: isEmpty(defaultMessage) ? messageId : defaultMessage,
    replace: value,
    interpolation: {
      prefix: "{",
      suffix: "}"
    }
  })
}

export const getBool = (val) => {
  if (isUndefined(val)) return false
  const num = +val
  return !isNaN(num) ? !!num : !!String(val).toLowerCase().replace(!!0, "")
}

export const fieldLabel = (module, field) => {
  if (isUndefined(field)) return ""
  const msgId = `modules.${module}.fields.${field}`
  return useFormatMessage(msgId, {})
}

export const formatNumber = (value, options) => {
  return addComma(value)
  //return i18n.formatNumber(value, options)
}

export const removeComma = (num) => {
  if (num !== null && (num !== "") & (num !== undefined))
    return num.toString().replace(/,/g, "")
  else return null
}

export const addComma = (num) => {
  const number = removeComma(num)
  if (number !== null && number !== "") {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  } else return null
}

export const paginationGenerate = (c, m) => {
  const current = c,
    last = m,
    delta = 2,
    left = current - delta,
    right = current + delta + 1,
    range = [],
    rangeWithDots = []
  let l
  for (let i = 1; i <= last; i++) {
    if (i === 1 || i === last || (i >= left && i < right)) {
      range.push(i)
    }
  }

  for (const i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push("...")
      }
    }
    rangeWithDots.push(i)
    l = i
  }

  return rangeWithDots
}

export const objectMap = (obj, fn, customKey = false) =>
  Object.fromEntries(
    Object.entries(obj).map(([k, v], i) =>
      customKey ? fn(k, v, i) : [k, fn(k, v, i)]
    )
  )

const shallowPartialCompare = (obj, partialObj) =>
  Object.keys(partialObj).every(
    (key) => obj.hasOwnProperty(key) && obj[key] === partialObj[key]
  )

export const useMergedState = (initial) => {
  const [state, setState] = React.useState(initial)
  const setMergedState = (newIncomingState) =>
    setState((prevState) => {
      const newState =
        typeof newIncomingState === "function"
          ? newIncomingState(prevState)
          : newIncomingState
      return shallowPartialCompare(prevState, newState)
        ? prevState
        : { ...prevState, ...newState }
    })
  return [state, setMergedState]
}

export const functionUnderContruction = () => {
  SwAlert.showInfo({
    title: "Oops...",
    text: useFormatMessage("errors.common.function_contruction")
  })
}

export const coppyLink = (content) => {
  const el = document.createElement("textarea")
  el.value = content
  el.setAttribute("readonly", "")
  el.style.position = "absolute"
  el.style.left = "-9999px"
  document.body.appendChild(el)
  el.select()
  el.setSelectionRange(0, 99999)
  document.execCommand("copy")
  document.body.removeChild(el)
  notification.showInfo({
    title: "Copied!",
    text: "Content was copied to clipboard",
    position: "bottom-center"
  })
}

export const ExportData = (fileName, fileFormat, data) => {
  const bookType = fileFormat
  const ws = XLSX.utils.aoa_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "SheetJS")
  const wbout = XLSX.write(wb, { bookType, bookSST: true, type: "binary" })

  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length)
    const view = new Uint8Array(buf)
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff
    return buf
  }
  const file = fileName.length
    ? `${fileName}.${fileFormat}`
    : `excel-sheet.${fileFormat}`

  return FileSaver.saveAs(
    new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
    file
  )
}

export const sortFieldsDisplay = (
  a,
  b,
  fieldSort = "field_form_order",
  defaultFieldSort = "id"
) => {
  if (a[fieldSort] !== 0 && b[fieldSort] !== 0)
    return parseFloat(a[fieldSort]) > parseFloat(b[fieldSort]) ? 1 : -1
  else return a[defaultFieldSort] > b[defaultFieldSort] ? 1 : -1
}

export const getBase64 = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      resolve({ file, src: reader.result, fileID: file.lastModified })
    }
  })

export const getMonthName = (month, length) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]
  return months[month].substring(0, length)
}

export const timeDifference = (dateInput) => {
  const date = new Date(dateInput)
  const millisec = Math.abs(date - Date.now())
  const sec = Math.floor(millisec / 1000)
  const mins = Math.floor(millisec / 60000)
  const hrs = Math.floor(mins / 60)
  const days = Math.floor(hrs / 24)
  if (days <= 0) {
    if (hrs <= 0) {
      if (mins <= 0) {
        return `${sec} ${useFormatMessage("common.seconds")} ${useFormatMessage(
          "common.ago"
        )}`
      }
      return `${mins} ${useFormatMessage("common.minutes")} ${useFormatMessage(
        "common.ago"
      )}`
    }
    return `${hrs} ${useFormatMessage("common.hours")} ${useFormatMessage(
      "common.ago"
    )}`
  } else if (days <= 30) {
    return `${days} ${useFormatMessage("common.days")} ${useFormatMessage(
      "common.ago"
    )}`
  } else {
    return `${date.getHours()}:${date.getMinutes()}, ${date.getDate()} ${getMonthName(
      date.getMonth(),
      3
    )}`
  }
}

export const convertSecToMinSec = (sec) => {
  let second = Math.floor(sec)
  const min = Math.floor(second / 60)
  second = second - min * 60
  second = second.toString()
  if (second.length === 1) {
    second = `0${second}`
  }
  return `${min}:${second}`
}

export const getErrors = (error) => {
  return error.response ? error.response : null
}
/*
 * var string = stringInject("This is a {0} string for {1}", ["test", "stringInject"]);
 * var str = stringInject("My username is {username} on {platform}", { username: "tjcafferkey", platform: "GitHub" });
 */
export const stringInject = (str, data) => {
  if (typeof str === "string" && data instanceof Array) {
    return str.replace(/({\d})/g, function (i) {
      return data[i.replace(/{/, "").replace(/}/, "")]
    })
  } else if (typeof str === "string" && data instanceof Object) {
    if (Object.keys(data).length === 0) {
      return str
    }

    for (const keyr in data) {
      return str.replace(/({([^}]+)})/g, function (i) {
        const key = i.replace(/{/, "").replace(/}/, "")
        if (!data[key]) {
          return i
        }

        return data[key]
      })
    }
  } else if (
    (typeof str === "string" && data instanceof Array === false) ||
    (typeof str === "string" && data instanceof Object === false)
  ) {
    return str
  } else {
    return false
  }
}

export const currentDateTime = () => {
  return moment().format("YYYY-MM-DD HH:mm:ss")
}

export const formatDate = (date, format = "DD/MM/YYYY") => {
  return moment(date).format(format)
}

export const formatDateTime = (date) => {
  return moment(date).format("DD/MM/YYYY HH:mm")
}

export const formatTime = (date) => {
  return moment(date).format("HH:mm")
}

export const decamelize = (str, separator = "_") => {
  separator = typeof separator === "undefined" ? "_" : separator

  return str
    .replace(/([a-z\d])([A-Z])/g, "$1" + separator + "$2")
    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, "$1" + separator + "$2")
    .toLowerCase()
}

export const getOptionValue = (options, optionName, nameOptionKey) => {
  const option = options[optionName]
  let valueOption = 0
  forEach(option, (item, key) => {
    if (item.name_option === nameOptionKey) {
      valueOption = item.value
      return false
    }
  })
  return parseInt(valueOption)
}

export const getDefaultFridayLogo = (type = "icon") => {
  const logoName = type === "text" ? "friday_text.png" : "friday.png"
  return process.env.REACT_APP_URL + "/assets/images/" + logoName
}

export const getAvatarUrl = (userOrPath) => {
  const type = _.isNumber(userOrPath) ? "user" : "name"
  return (
    process.env.REACT_APP_API_URL + `/download/avatar?${type}=` + userOrPath
  )
}

export const getPublicDownloadUrl = (path, type = "image") => {
  return process.env.REACT_APP_API_URL + `/download/public/${type}?name=` + path
}
