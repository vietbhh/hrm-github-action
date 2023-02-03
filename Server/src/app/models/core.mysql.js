import { mysql } from "../config/mysql.js"

const coreModelMysql = (table, definition, options = {}) => {
  return mysql.define(table, definition, options)
}

export default coreModelMysql
