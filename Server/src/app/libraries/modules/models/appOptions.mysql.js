import { DataTypes } from "sequelize"
import appModelMysql from "../../../models/app.mysql.js"

const appOptionsModel = appModelMysql("app_options", {
  table: {
    type: DataTypes.TEXT
  },
  meta_id: {
    type: DataTypes.INTEGER
  },
  field: {
    type: DataTypes.TEXT
  },
  value: {
    type: DataTypes.TEXT
  },
  icon: {
    type: DataTypes.TEXT
  },
  default: {
    type: DataTypes.TINYINT
  },
  order: {
    type: DataTypes.INTEGER
  }
})

const getMetaFieldOptions = async (table, field = null) => {
  const condition = {}
  if (field !== null) {
    condition["field"] = field
  }

  const result = await appOptionsModel.findAll({
    attributes: [
      "id",
      "table",
      "meta_id",
      "field",
      "value",
      "icon",
      "default",
      "order"
    ],
    where: {
      table: table,
      ...condition
    }
  })

  return result
}

export { appOptionsModel, getMetaFieldOptions }
