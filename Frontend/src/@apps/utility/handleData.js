import { forEach } from "lodash-es"

export const isUndefined = (value) => value === undefined

export const isNull = (value) => value === null

export const isBoolean = (value) => typeof value === "boolean"

export const isObject = (value) => value === Object(value)

export const isArray = (value) => Array.isArray(value)

export const isDate = (value) => value instanceof Date

export const isBlob = (value) =>
  value &&
  typeof value.size === "number" &&
  typeof value.type === "string" &&
  typeof value.slice === "function"

export const isFile = (value) =>
  isBlob(value) &&
  typeof value.name === "string" &&
  (typeof value.lastModifiedDate === "object" ||
    typeof value.lastModified === "number")

export const isFileList = (value) => {
  let result = true
  if (isFile(value)) return true
  if (!isObject(value)) return false

  Object.keys(value).forEach((prop) => {
    const checkItem = value[prop]
    if (!isFile(checkItem)) {
      result = false
    }
  })
  return result
}

export const erpSelectToValues = (obj) => {
  if (isUndefined(obj)) {
    return obj
  } else if (isFile(obj)) {
    return obj
  } else if (isNull(obj)) {
    return obj
  } else if (isArray(obj)) {
    if (obj.length) {
      obj.forEach((value, index) => {
        obj[index] = erpSelectToValues(value)
      })
    }
  } else if (isObject(obj) && !isFile(obj) && !isBlob(obj)) {
    if (
      Object.keys(obj).length === 2 &&
      obj.hasOwnProperty("value") &&
      obj.hasOwnProperty("label")
    ) {
      return obj.value
    } else if (
      Object.keys(obj).length === 4 &&
      obj.hasOwnProperty("value") &&
      obj.hasOwnProperty("label") &&
      obj.hasOwnProperty("icon") &&
      obj.hasOwnProperty("name_option")
    ) {
      return obj.value
    } else if (
      Object.keys(obj).length === 4 &&
      obj.hasOwnProperty("value") &&
      obj.hasOwnProperty("label") &&
      obj.hasOwnProperty("halfChecked") &&
      obj.hasOwnProperty("disabled")
    ) {
      return obj.value
    } else if (
      Object.keys(obj).length === 4 &&
      obj.hasOwnProperty("value") &&
      obj.hasOwnProperty("label") &&
      obj.hasOwnProperty("icon") &&
      obj.hasOwnProperty("text")
    ) {
      return obj.value
    } else if (
      Object.keys(obj).length <= 15 &&
      obj.hasOwnProperty("value") &&
      obj.hasOwnProperty("label") &&
      obj.hasOwnProperty("email") &&
      obj.hasOwnProperty("full_name")
    ) {
      return obj.value
    } else {
      Object.keys(obj).forEach((prop) => {
        const value = obj[prop]
        if (isFile(value)) {
          return obj
        } else {
          obj[prop] = erpSelectToValues(value)
        }
      })
    }
  }
  return obj
}

export const valuesToErpSelect = (obj, keyArray) => {
  if (isUndefined(obj)) {
    return obj
  } else if (isNull(obj)) {
    return obj
  } else if (isArray(obj)) {
    if (obj.length) {
      obj.forEach((value, index) => {
        obj[index] = valuesToErpSelect(value, keyArray)
      })
    }
  } else if (isObject(obj) && !isFile(obj) && !isBlob(obj)) {
    Object.keys(obj).forEach((prop) => {
      const value = obj[prop]
      if (keyArray.includes(prop) && typeof value === "string") {
        obj[prop] = {
          label: value,
          value: value
        }
      } else {
        obj[prop] = valuesToErpSelect(value, keyArray)
      }
    })
  }
  return obj
}

export const serialize = (obj, cfg, fd, pre) => {
  cfg = cfg || {}

  cfg.indices = isUndefined(cfg.indices) ? true : cfg.indices

  cfg.nullsAsUndefineds = isUndefined(cfg.nullsAsUndefineds)
    ? false
    : cfg.nullsAsUndefineds

  cfg.booleansAsIntegers = isUndefined(cfg.booleansAsIntegers)
    ? false
    : cfg.booleansAsIntegers

  cfg.allowEmptyArrays = isUndefined(cfg.allowEmptyArrays)
    ? true
    : cfg.allowEmptyArrays
  cfg.erpSelectToValues = isUndefined(cfg.erpSelectToValues)
    ? true
    : cfg.erpSelectToValues

  fd = fd || new FormData()

  if (isUndefined(obj)) {
    return fd
  } else if (isNull(obj)) {
    if (!cfg.nullsAsUndefineds) {
      fd.append(pre, "")
    }
  } else if (isBoolean(obj)) {
    if (cfg.booleansAsIntegers) {
      fd.append(pre, obj ? 1 : 0)
    } else {
      fd.append(pre, obj)
    }
  } else if (isArray(obj)) {
    if (obj.length) {
      obj.forEach((value, index) => {
        const key = pre + "[" + (cfg.indices ? index : "") + "]"

        serialize(value, cfg, fd, key)
      })
    } else if (cfg.allowEmptyArrays) {
      fd.append(pre + "[]", "")
    }
  } else if (isDate(obj)) {
    fd.append(pre, obj.toISOString())
  } else if (isObject(obj) && obj.hasOwnProperty("_isAMomentObject")) {
    fd.append(pre, obj.format("YYYY-MM-DD HH:mm"))
  } else if (
    isObject(obj) &&
    !isFile(obj) &&
    !isBlob(obj) &&
    !obj.hasOwnProperty("_isAMomentObject")
  ) {
    obj = cfg.erpSelectToValues ? erpSelectToValues(obj) : obj
    if (!isObject(obj)) serialize(obj, cfg, fd, pre)
    else {
      Object.keys(obj).forEach((prop) => {
        const value = obj[prop]
        if (isArray(value)) {
          while (
            prop.length > 2 &&
            prop.lastIndexOf("[]") === prop.length - 2
          ) {
            prop = prop.substring(0, prop.length - 2)
          }
        }
        const key = pre ? pre + "[" + prop + "]" : prop
        serialize(value, cfg, fd, key)
      })
    }
  } else {
    fd.append(pre, obj)
  }

  return fd
}

export const object2QueryString = (data, pre = "") => {
  let string = ""
  forEach(data, (value, key) => {
    if (isObject(value) && !value.hasOwnProperty("_isAMomentObject")) {
      const newKey = pre ? pre + "[" + key + "]" : key
      string += object2QueryString(value, newKey)
    } else if (isObject(value) && value.hasOwnProperty("_isAMomentObject")) {
      const newKey = pre ? pre + "[" + key + "]" : key
      string += "&" + newKey + "=" + value.format("YYYY-MM-DD HH:mm")
    } else {
      const newKey = pre ? pre + "[" + key + "]" : key
      string += "&" + newKey + "=" + value
    }
  })
  return string
}
