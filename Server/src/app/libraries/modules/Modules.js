import appModelMysql from "#app/models/app.mysql.js"
import { DataTypes, Op, where } from "sequelize"
import { createRequire } from "node:module"
const require = createRequire(import.meta.url)

const configBase = require("./config/config_base.json")
const systemModules = require("./config/config_system_modules.json")
import { forEach, isEmpty } from "lodash-es"
import { getModule } from "./models/modules.mysql.js"
import { getModuleMetas } from "./models/modules_metas.mysql.js"

const _handleMetaType = (field_type) => {
  const { fieldTypeDef } = configBase
  const fieldType = fieldTypeDef?.[field_type] ?? fieldTypeDef.other
  let returnType = DataTypes.STRING
  const defaultValue = fieldType.default ?? null
  switch (fieldType.type) {
    case "varchar":
      returnType = DataTypes.STRING(fieldType.constraint)
      break
    case "int":
      returnType = DataTypes.INTEGER(fieldType.constraint)
      break
    case "decimal":
      returnType = DataTypes.DECIMAL(fieldType.constraint)
      break
    case "longtext":
      returnType = DataTypes.TEXT
      break
    case "date":
      returnType = DataTypes.DATEONLY
      break
    case "datetime":
      returnType = DataTypes.DATE
      break
    case "time":
      returnType = DataTypes.TIME
      break
    case "json":
      returnType = DataTypes.JSON
      break
    case "smallint":
      returnType = DataTypes.SMALLINT.UNSIGNED
      break
    case "tinyint":
      returnType = DataTypes.BOOLEAN
      break
  }
  return {
    type: returnType,
    defaultValue: defaultValue
  }
}

const _buildModelDefinition = (metas = {}) => {
  let definition = {}
  forEach(metas, (item, key) => {
    definition[item.field] = {
      ..._handleMetaType(item.field_type)
    }
  })
  return definition
}

const moduleModel = async (moduleName, customDefinition = {}, options = {}) => {
  let definition = {}
  let moduleData = undefined
  //Check system module
  if (systemModules?.[moduleName]) {
    moduleData = systemModules?.[moduleName]
    definition = _buildModelDefinition(moduleData?.metas)
  } else {
    moduleData = await getModule(moduleName)
    const moduleMetas = await getModuleMetas(moduleData.id)
    definition = _buildModelDefinition(moduleMetas)
  }
  if (!moduleData) throw new Error("MODULE_NOT_FOUND")

  definition = { ...definition, ...customDefinition }
  const model = appModelMysql(moduleData.tableName, definition, options)

  return model
}
export { moduleModel }
