import { DataTypes, Op, where } from "sequelize"
import coreModelMysql from "./core.mysql.js"

const emailModel = coreModelMysql(
  "email",
  {
    config: {
      type: DataTypes.STRING
    },
    subject: {
      type: DataTypes.STRING
    },
    content: {
      type: DataTypes.TEXT
    },
    attachments: {
      type: DataTypes.TEXT
    },
    from: {
      type: DataTypes.STRING
    },
    to: {
      type: DataTypes.STRING
    },
    cc: {
      type: DataTypes.TEXT
    },
    bcc: {
      type: DataTypes.TEXT
    },
    status: {
      type: DataTypes.ENUM(["pending", "sending", "success", "failed"])
    },
    respond: {
      type: DataTypes.TEXT
    },
    time_expected: {
      type: DataTypes.DATE
    },
    time_real: {
      type: DataTypes.DATE
    }
  },
  {
    freezeTableName: true
  }
)

const getPendingMail = async (condition = {}) => {
  const list = await emailModel.findAll({
    where: {
      status: "pending",
      ...condition
    }
  })

  return list
}

export { emailModel, getPendingMail }
