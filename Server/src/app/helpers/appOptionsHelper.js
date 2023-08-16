import { map } from "lodash-es"
// ** model
import { getMetaFieldOptions } from "#app/libraries/modules/models/appOptions.mysql.js"
import { getModule } from "#app/libraries/modules/models/modules.mysql.js"

export const getAppSelectOption = async (moduleName, field = null) => {
  const moduleInfo = await getModule(moduleName)
  const name = moduleInfo["name"]
  const tableName = moduleInfo["tableName"]

  const data = await loadDbAppSelectOptions(tableName, field, name)

  return data
}

export const loadDbAppSelectOptions = async (
  table,
  field = null,
  name = ""
) => {
  const data = await getMetaFieldOptions(table, field)
  const selectData = {}
  map(data, (item) => {
    const pushItem = {
      value: item.id,
      label: "",
      icon: item.icon,
      name_option: item.value
    }
    if (selectData[item.field] === undefined) {
      selectData[item.field] = [pushItem]
    } else {
      selectData[item.field].push(pushItem)
    }
  })
  
  return selectData
}

export const getOptionValue = async (module, field, nameOption) => {
  const listOption = await getAppSelectOption(module, field)
  let value = ""

  if (listOption[field] !== undefined) {
    const listOptionByField = listOption[field]
    map(listOptionByField, (item) => {
      if (nameOption === item["name_option"]) {
        value = item["value"]
        return
      }
    })
  }

  return value
}
