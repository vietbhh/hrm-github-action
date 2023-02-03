import { DataTypes } from "sequelize"
import appModelMysql from "./app.mysql.js"

const notificationsModelMysql = appModelMysql("notifications", {
  sender_id: {
    type: DataTypes.INTEGER
  },
  recipient_id: {
    type: DataTypes.TEXT("long")
  },
  type: {
    type: DataTypes.ENUM(["system", "other"]),
    defaultValue: "other"
  },
  title: {
    type: DataTypes.TEXT
  },
  body: {
    type: DataTypes.TEXT
  },
  link: {
    type: DataTypes.TEXT("long")
  },
  icon: {
    type: DataTypes.TEXT("long")
  },
  read_by: {
    type: DataTypes.TEXT("long"),
    defaultValue: "[]"
  }
})
export { notificationsModelMysql }
