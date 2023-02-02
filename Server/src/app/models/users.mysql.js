import { isNumber } from "lodash-es"
import { DataTypes } from "sequelize"
import appModelMysql from "./app.mysql.js"

const usersModel = appModelMysql("users", {
  full_name: {
    type: DataTypes.STRING
  },
  username: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING
  },
  phone: {
    type: DataTypes.STRING
  },
  activate_hash: {
    type: DataTypes.STRING
  },
  reset_hash: {
    type: DataTypes.STRING
  },
  avatar: {
    type: DataTypes.STRING
  },
  reset_at: {
    type: DataTypes.DATE
  },
  reset_expires: {
    type: DataTypes.DATE
  },
  dob: {
    type: DataTypes.DATE
  },
  account_status: {
    type: DataTypes.ENUM(["uninvited", "invited", "activated", "deactivated"])
  },
  force_pass_reset: {
    type: DataTypes.TINYINT
  },
  active: {
    type: DataTypes.TINYINT
  },
  gender: {
    type: DataTypes.INTEGER
  },
  code: {
    type: DataTypes.STRING
  },
  office: {
    type: DataTypes.INTEGER
  },
  group_id: {
    type: DataTypes.INTEGER
  },
  job_title_id: {
    type: DataTypes.INTEGER
  },
  department_id: {
    type: DataTypes.INTEGER
  },
  device_token: {
    type: DataTypes.JSON
  }
})

const getUser = (identity) => {
  return isNumber(identity)
    ? usersModel.findByPk(identity)
    : usersModel.findOne({
        username: identity
      })
}

const getUsers = (ids) => {
  return usersModel.findAll({
    where: {
      id: ids
    }
  })
}

export { getUser, getUsers, usersModel }
