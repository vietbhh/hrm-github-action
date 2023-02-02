import { DataTypes } from "sequelize"
import coreModelMysql from "./core.mysql.js"

const appModelMysql = (table, definition, options = {}) => {
  const hooks = options?.hooks ?? {}
  return coreModelMysql(
    table,
    {
      owner: {
        type: DataTypes.INTEGER
      },
      created_by: {
        type: DataTypes.INTEGER
      },
      updated_by: {
        type: DataTypes.INTEGER
      },
      deleted_at: {
        type: DataTypes.DATE
      },
      ...definition
    },
    {
      hooks: {
        beforeCreate: (record, options) => {
          if (!options.__user) throw new Error("missing_user_id")
          record.owner = options.__user
          record.created_by = options.__user
        },
        beforeUpdate: (record, options) => {
          if (!options.__user) throw new Error("missing_user_id")
          record.updated_by = options.__user
        },
        ...hooks
      },
      ...options
    }
  )
}

export default appModelMysql
