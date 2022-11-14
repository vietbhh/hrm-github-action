import moment from "moment"

const convertDateGetDay = (date) => {
  if (date === "" || date === undefined || date === "0000-00-00") return ""
  return moment(date).format("DD")
}

const convertDateGetMonth = (date) => {
  if (date === "" || date === undefined || date === "0000-00-00") return ""
  return moment(date).format("MMM")
}

const convertTime = (time) => {
  if (time === "" || time === undefined) return ""
  const d = time.split(":")
  return `${d[0]}:${d[1]}`
}

export { convertDateGetDay, convertDateGetMonth, convertTime }
