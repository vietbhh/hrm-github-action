import { addComma } from "@apps/utility/common"
import { isUndefined } from "lodash"
import moment from "moment"


const formatNumberWithUnit = (number) => {
  const symbol = ["", "k", "M", "G", "T", "P", "E"]

  const tier = (Math.log10(Math.abs(number)) / 3) | 0

  if (tier === 0) {
    return number
  }

  const suffix = symbol[tier]
  const scale = Math.pow(10, tier * 3)
  const scaled = number / scale

  return `${scaled.toFixed(2)} ${suffix}`
}

const convertNumberCurrency = (num, negative = false, formatWithUnit = false) => {
  const settings = JSON.parse(localStorage.settings)
  const currency = settings.payroll_setting_currency
  if (formatWithUnit) {
    return `${currency} ${negative ? "-" : ""}${formatNumberWithUnit(num)}`
  }

  if (num) {
    num = Math.round(num * 100) / 100
    const result = `${currency} ${negative ? "-" : ""}${addComma(num)}`
    return result
  }
  
  const result = `${currency} 0`
  return result
}

const convertDate = (date) => {
  if (_.isEmpty(date) || date === "0000-00-00") {
    return ""
  }

  return moment(date).format("DD MMM YYYY")
}

const convertDateToMonthDay = (date) => {
  if (_.isEmpty(date) || date === "0000-00-00") {
    return ""
  }

  return moment(date).format("MMM DD")
}

const minsToStr = (t) => {
  if (isUndefined(t) || t === 0) {
    return "0h"
  }
  const time = Math.floor(t % 60)
  return (
    Math.trunc(t / 60) +
    "h " +
    ("00" + (time === 0 ? "" : time)).slice(-2) +
    "m"
  )
}

const minsToStrCeil = (t) => {
  if (isUndefined(t) || t === 0) {
    return "0h"
  }
  let hours = Math.trunc(t / 60)
  let mins = Math.ceil(t % 60)
  if (mins === 60) {
    hours += 1
    mins = 0
  }
  return hours + "h " + ("00" + (mins === 0 ? "" : mins)).slice(-2) + "m"
}

export {
  convertNumberCurrency,
  convertDate,
  convertDateToMonthDay,
  minsToStr,
  minsToStrCeil
}
