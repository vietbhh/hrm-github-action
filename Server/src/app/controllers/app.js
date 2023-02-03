import smartSheetModelMongo from "#app/models/smartsheet.mongo.js"
import { _uploadServices } from "#app/services/upload.js"
import path from "path"
export const testFn = async (req, res, next) => {
  const row = new smartSheetModelMongo({
    title: "test",
    description: "test222",
    __user: 1
  })
  const result = await _uploadServices(path.join("feed", "post"), req.files)
  console.log(result)
  //const setting = await saveSetting("dashboard_widget", "deft", 1000)
  //console.log(typeof setting, setting)
  //const setting = getCache("test")
  /* return row
    .save()
    .then((newRow) => res.respond(newRow))
    .catch((err) => {
      return res.fail(err.message)
    }) */
  return true
}

export const homeController = (req, res, next) => {
  return res.respond("Thanks god,it's Friday!!!")
}
