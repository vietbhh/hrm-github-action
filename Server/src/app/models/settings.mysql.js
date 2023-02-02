import { isEmpty, isNumber, toNumber } from "lodash-es"
import { serialize } from "php-serialize"
import { DataTypes, Op } from "sequelize"
import coreModelMysql from "./core.mysql.js"

const settingsModelMysql = coreModelMysql("settings", {
  key: {
    type: DataTypes.STRING
  },
  class: {
    type: DataTypes.STRING
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: "string"
  },
  value: {
    type: DataTypes.TEXT("long")
  },
  summary: {
    type: DataTypes.STRING
  },
  config: {
    type: DataTypes.TEXT("long")
  },
  protected: {
    type: DataTypes.TINYINT
  },
  secret: {
    type: DataTypes.TINYINT
  },
  context: {
    type: DataTypes.STRING
  }
})

const findSettings = async (key = null, context = null) => {
  const keyArray = key.split(".")
  if (!key) return null
  const settingClass = keyArray.length === 1 ? "Preferences" : keyArray[0]
  const settingKey = keyArray.length === 1 ? key : keyArray[1]
  let settingContext = {
    context: {
      [Op.is]: null
    }
  }
  if (context !== null) {
    let contextCondition = context
    if (isNumber(context * 1)) contextCondition = "user:" + context
    settingContext = {
      [Op.or]: [
        {
          context: {
            [Op.eq]: contextCondition
          }
        },
        {
          context: {
            [Op.eq]: null
          }
        }
      ]
    }
  }
  //if for cache purpose,need remove where condition
  return await settingsModelMysql.findAll({
    where: {
      key: settingKey,
      class: settingClass,
      ...settingContext
    }
  })
}

const getSettingsFromDB = async (key = null, context = null) => {
  const listSetting = await findSettings(key, context)
  let settings = {}
  for (const setting of listSetting) {
    const keyClass = setting.class + "." + setting.key
    const settingValue = {
      class: setting.class,
      key: setting.key,
      value: setting.value,
      type: setting.type,
      summary: setting.summary,
      config: setting.config ? JSON.parse(setting.config) : {},
      protected: toNumber(setting.protected) === 1 ? true : false,
      secret: toNumber(setting.secret) === 1 ? true : false,
      context: setting.context
    }
    if (setting.context) {
      settings = {
        ...settings,
        [setting.context]: {
          ...settings?.[setting.context],
          [keyClass]: settingValue
        }
      }
    } else {
      settings = {
        ...settings,
        default: {
          ...settings.default,
          [keyClass]: settingValue
        }
      }
    }
  }
  return settings
}

const prepareValue = (value, type) => {
  switch (type) {
    case "boolean":
      return value === TRUE ? 1 : 0
    case "integer":
      return toInteger(value)
    case "double":
      return toNumber(value)
    case "array" || "object":
      return serialize(value)
    default:
      return value
  }
}

const saveSettingToDb = async (key, value, context = null) => {
  const settings = await findSettings(key, context)
  if (isEmpty(settings)) throw new Error(`setting_[${key}]_not_exist`)
  let saveSetting = undefined
  let keyContext = context
  if (context) {
    if (isNumber(context * 1)) keyContext = "user:" + context
  }
  let createNewContext = true
  for (const setting of settings) {
    if (!setting.context) {
      saveSetting = setting
    }
    if (context && keyContext === setting.context) {
      saveSetting = setting
      createNewContext = false
    }
  }
  saveSetting.value = prepareValue(value, saveSetting.type)

  if (context && createNewContext) {
    return await settingsModelMysql.create({
      class: saveSetting.class,
      key: saveSetting.key,
      value: saveSetting.value,
      type: saveSetting.type,
      summary: saveSetting.summary,
      protected: saveSetting.protected,
      secret: saveSetting.secret,
      context: keyContext
    })
  }

  return await saveSetting.save().then((res) => console.log(res))
}

export { settingsModelMysql, getSettingsFromDB, saveSettingToDb }
