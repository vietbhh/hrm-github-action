import {
  getSettingsFromDB,
  saveSettingToDb
} from "#app/models/settings.mysql.js"
import { isEmpty, isNumber, isString, toInteger, toNumber } from "lodash-es"
import { isSerialized, unserialize } from "php-serialize"

const parseValue = (value, type = "string") => {
  switch (type) {
    case "boolean":
      return toNumber(value) === 1 ? true : false
    case "integer":
      return toInteger(value)
    case "double":
      return toNumber(value)
    case "array" || "object":
      return isSerialized(value) ? unserialize(value) : value
    default:
      return value
  }
}

const getSetting = async (
  key,
  context = null,
  onlyValue = true,
  forceUpdateDB = false
) => {
  if (!key) return undefined
  //Comment for cache purpose if it need
  /*let listAllSetting = getCache("settings")
  if (!listAllSetting || forceUpdateDB) {
    listAllSetting = await getSettingsFromDB()
    setCache("settings", listAllSetting)
  } */
  const listAllSetting = await getSettingsFromDB(key, context)
  if (isEmpty(listAllSetting)) return undefined

  const settingKey = key.indexOf(".") !== -1 ? key : "Preferences." + key
  let settingValue = listAllSetting.default?.[settingKey]

  if (context) {
    let contextSetting = listAllSetting?.[context]?.[settingKey]
    if (isString(context) && context.indexOf(":") !== -1 && contextSetting)
      settingValue = contextSetting

    if (isNumber(context * 1)) {
      const keyContext = "user:" + context
      contextSetting = listAllSetting?.[keyContext]?.[settingKey]
      if (contextSetting) settingValue = contextSetting
    }
  }
  const result = settingValue?.value
    ? parseValue(settingValue?.value, settingValue.type)
    : settingValue?.value
  return onlyValue ? result : settingValue
}

const saveSetting = async (key, value, context) => {
  return await saveSettingToDb(key, value, context)
}

export { getSetting, saveSetting }
