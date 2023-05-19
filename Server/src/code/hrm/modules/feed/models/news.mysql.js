import appModelMysql from "#app/models/app.mysql.js"
import { DataTypes } from "sequelize"

const newsModel = appModelMysql("m_news", {
  title: {
    type: DataTypes.STRING
  },
  content: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.STRING
  },
  employee: {
    type: DataTypes.STRING
  },
  important: {
    type: DataTypes.TINYINT
  },
  total_comment: {
    type: DataTypes.INTEGER
  },
  important_end_date: {
    type: DataTypes.DATE
  },
  pin: {
    type: DataTypes.TINYINT
  },
  show_announcements: {
    type: DataTypes.STRING
  },
  attachment: {
    type: DataTypes.STRING
  },
  department: {
    type: DataTypes.STRING
  },
  id_post: {
    type: DataTypes.STRING
  },
  send_to: {
    type: DataTypes.STRING
  }
})

export { newsModel }
