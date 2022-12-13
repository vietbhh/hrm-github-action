import { Users } from "#app/models/user.model.mysql.js"

export const getUser = (id) => {
  return Users.findByPk(id)
}
