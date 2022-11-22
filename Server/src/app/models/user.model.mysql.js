import { DataTypes } from "sequelize"
import { mysql } from "../config/mysql.js"

const Users = mysql.define("users", {
  username: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING
  },
  full_name: {
    type: DataTypes.STRING
  },
  dob: {
    type: DataTypes.DATE
  },
  gender: {
    type: DataTypes.INTEGER
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
  }
})

export { Users }
