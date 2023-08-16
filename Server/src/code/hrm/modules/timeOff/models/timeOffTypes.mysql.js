import appModelMysql from "#app/models/app.mysql.js"
import { DataTypes, Op } from "sequelize"

const timeOffTypesModel = appModelMysql("m_time_off_types", {
  name: {
    type: DataTypes.STRING
  }
})

export { timeOffTypesModel }
