import { Users } from "#app/models/users.model.mysql.js"

export const testFn = (req, res, next) => {
  const user = Users.findAll().then((res) => {
    console.log(res)
  })
  console.log(user)
  const row = new smartsheetMongo({
    _id: mongoose.Types.ObjectId(),
    title: "test",
    description: "test222"
  })
  return row
    .save()
    .then((newRow) => res.respond(newRow))
    .catch((err) => console.log(err))
}
