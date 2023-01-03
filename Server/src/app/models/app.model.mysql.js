import { DataTypes } from "sequelize"
import coreModel from "./core.model.mysql.js"

class appModel extends coreModel {
  constructor(table, definition, options = {}) {
    super(
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
      options
    )
  }
  friCreate = (data, userId) => {
    return this.builder.create({
      owner: userId,
      created_by: userId,
      ...data
    })
  }
}

export default appModel
