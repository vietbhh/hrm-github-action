import { DataTypes } from "sequelize"
import { mysql } from "../config/mysql.js"

const notificationsModel = mysql.define("notifications", {
  sender_id: {
    type: DataTypes.INTEGER
  },
  recipient_id: {
    type: DataTypes.TEXT("long")
  },
  type: {
    type: DataTypes.ENUM(["system", "other"])
  },
  title: {
    type: DataTypes.TEXT
  },
  content: {
    type: DataTypes.TEXT
  },
  link: {
    type: DataTypes.TEXT("long")
  },
  read_by: {
    type: DataTypes.STRING
  },
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
  }
})

export { notificationsModel }
