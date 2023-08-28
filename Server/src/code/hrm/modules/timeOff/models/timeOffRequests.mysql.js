import appModelMysql from "#app/models/app.mysql.js"
import { DataTypes, Op } from "sequelize"

const timeOffRequestsModel = appModelMysql("m_time_off_requests", {
  owner: {
    type: DataTypes.INTEGER
  },
  created_at: {
    type: DataTypes.DATE
  },
  deleted_at: {
    type: DataTypes.DATE
  },
  updated_at: {
    type: DataTypes.DATE
  },
  note: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.TINYINT
  },
  date_from: {
    type: DataTypes.DATE
  },
  time_from: {
    type: DataTypes.TIME
  },
  date_to: {
    type: DataTypes.DATE
  },
  time_to: {
    type: DataTypes.TIME
  },
  is_full_day: {
    type: DataTypes.TINYINT
  },
  type: {
    type: DataTypes.INTEGER
  },
  created_by: {
    type: DataTypes.INTEGER
  },
  updated_by: {
    type: DataTypes.INTEGER
  }
})

export { timeOffRequestsModel }
