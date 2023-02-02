import smartSheetModelMongo from "#app/models/smartsheet.mongo.js"
import { getSetting, saveSetting } from "#app/services/settings.js"
export const testFn = async (req, res, next) => {
  const row = new smartSheetModelMongo({
    title: "test",
    description: "test222",
    __user: 1
  })
  const setting = await saveSetting("dashboard_widget", "deft",1000)
  console.log(typeof setting, setting)
  //const setting = getCache("test")
  /* return row
    .save()
    .then((newRow) => res.respond(newRow))
    .catch((err) => {
      return res.fail(err.message)
    }) */
  return true
}
