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
