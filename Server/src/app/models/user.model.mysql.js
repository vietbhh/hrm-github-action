import { DataTypes } from "sequelize"
import { mysql } from "../config/mysql.js"

const Users = mysql.define("users", {
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

export { Users }
