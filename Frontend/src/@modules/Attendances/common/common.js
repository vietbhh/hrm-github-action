import moment from "moment"

export const getTimeAttendance = (seconds, roundUp = false) => {
  const duration = moment.duration(seconds, "seconds")
  let hours = duration.hours()
  let minutes = duration.minutes()
  const secondsRemain = duration.seconds()
  if (secondsRemain === 60) {
    minutes = minutes + 1
  }

  if (roundUp && secondsRemain > 0) {
    minutes = minutes + 1
  }

  if (minutes >= 60) {
    minutes = 60 - minutes
    hours = hours + 1
  }
  return {
    hours: hours,
    minutes: minutes
  }
}

export const getTotalTimeAttendance = (seconds, roundUp = false) => {
  let hours = Math.floor(seconds / 3600)
  let minutes = Math.floor((seconds - hours * 3600) / 60)
  const secondsRemain = Math.floor(seconds - hours * 3600 - minutes * 60)
  if (secondsRemain === 60) {
    minutes = minutes + 1
  }
  if (roundUp && secondsRemain > 0) {
    minutes = minutes + 1
  }
  if (minutes >= 60) {
    minutes = 60 - minutes
    hours = hours + 1
  }

  return {
    hours: hours,
    minutes: minutes
  }
}

export const formatHour = (time, defaultReturn = "-") => {
  const newTime = moment(time)
  return newTime.isValid() ? newTime.format("hh:mm A") : defaultReturn
}

export const getRangeNumber = (start, end) => {
  return Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx)
}

export const getDistanceFromCoordinate = (lat1, lng1, lat2, lng2) => {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1) // deg2rad below
  const dLon = deg2rad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in km
  return d
}

export const getCurrentCoordinate = () => {
  if (Object.keys(navigator.geolocation).length > 0) {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition((position) => {
        const { coords } = position
        resolve({
          currentLat: coords.latitude,
          currentLng: coords.longitude
        })
      })
    })
  } else {
    return new Promise((resolve) => {
      resolve({
        currentLat: "",
        currentLng: ""
      })
    })
  }
}

const deg2rad = (deg) => {
  return deg * (Math.PI / 180)
}

export const getCurrentOfficeName = (optionsModules, employeeOffice) => {
  const [currentOffice] = optionsModules.offices.name.filter((item) => {
    return item.value === employeeOffice
  })

  return currentOffice?.label
}

export const getNumOrder = (date) => {
  const firstWeekLastDay = 7
  const secondWeekLastDay = 14
  const thirdWeekLastDay = 21
  const fourthWeekLastDay = 28
  if (date > fourthWeekLastDay) {
    return 5
  } else if (date <= firstWeekLastDay) {
    return 1
  } else if (date <= secondWeekLastDay) {
    return 2
  } else if (date <= thirdWeekLastDay) {
    return 3
  } else if (date <= fourthWeekLastDay) {
    return 4
  }

  return 0
}
