import { mysql } from "../config/mysql.js"

class coreModel {
  constructor(table, definition, options = {}) {
    this.builder = mysql.define(table, definition, options)
  }
}

export default coreModel
