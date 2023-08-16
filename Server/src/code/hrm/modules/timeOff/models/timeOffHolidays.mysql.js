import appModelMysql from "#app/models/app.mysql.js"
import { DataTypes, Op } from "sequelize"

const timeOffHolidaysModel = appModelMysql("m_time_off_holidays", {
  name: {
    type: DataTypes.STRING
  },
  from_date: {
    type: DataTypes.DATE
  },
  to_date: {
    type: DataTypes.DATE
  },
  year: {
    type: DataTypes.INTEGER
  },
  office_id: {
    type: DataTypes.INTEGER
  }
})

export { timeOffHolidaysModel }
