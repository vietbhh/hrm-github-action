import { getUser } from "#app/models/users.mysql.js"
import { forEach, isNumber } from "lodash-es"

export const getBool = (val) => {
  if (isUndefined(val)) return false
  const num = +val
  return !isNaN(num) ? !!num : !!String(val).toLowerCase().replace(!!0, "")
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

export const getBase64 = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      resolve({ file, src: reader.result, fileID: file.lastModified })
    }
  })

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
  return moment().format("DD/MM/YYYY h:mm:ss a")
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

export const getDefaultFridayLogo = (type = "icon") => {
  const logoName = type === "text" ? "friday_text.png" : "friday.png"
  return process.env.SITEURL + "/assets/images/" + logoName
}

export const getAvatarUrl = (userOrPath) => {
  const type = isNumber(userOrPath) ? "user" : "name"
  return process.env.BASEURL + `/download/avatar?${type}=` + userOrPath
}

export const getPublicDownloadUrl = (path, type = "image") => {
  return process.env.BASEURL + `/download/public/${type}?name=` + path
}

export const handleDataBeforeReturn = async (data, multiData = false) => {
  const arrData = multiData ? data : [data]
  const promises = []
  forEach(arrData, (dataItem, index) => {
    const _dataItem = { ...dataItem }
    const promise = new Promise(async (resolve, reject) => {
      if (dataItem["owner"] && isNumber(dataItem["owner"])) {
        const data_user = await getUser(dataItem["owner"])
        _dataItem["_doc"]["owner"] = {
          id: data_user.id,
          username: data_user.username,
          avatar: data_user.avatar,
          full_name: data_user.full_name,
          email: data_user.email
        }
      }

      if (dataItem["created_by"] && isNumber(dataItem["created_by"])) {
        const data_user = await getUser(dataItem["created_by"])
        _dataItem["_doc"]["created_by"] = {
          id: data_user.id,
          username: data_user.username,
          avatar: data_user.avatar,
          full_name: data_user.full_name,
          email: data_user.email
        }
      }

      if (dataItem["updated_by"] && isNumber(dataItem["updated_by"])) {
        const data_user = await getUser(dataItem["updated_by"])
        _dataItem["_doc"]["updated_by"] = {
          id: data_user.id,
          username: data_user.username,
          avatar: data_user.avatar,
          full_name: data_user.full_name,
          email: data_user.email
        }
      }

      resolve(_dataItem["_doc"])
    })
    promises.push(promise)
  })

  const result = await Promise.all(promises).then((res_promise) => {
    return res_promise
  })

  return result
}
