import smartSheetModelMongo from "#app/models/smartsheet.mongo.js"
import { _uploadServices, copyFilesServices, moveFileFromServerToGCS } from "#app/services/upload.js"
import path from "path"
export const testFn = async (req, res, next) => {
  const row = new smartSheetModelMongo({
    title: "test",
    description: "test222",
    __user: 1
  })
  const result = await _uploadServices(
    path.join("modules", "feed", "post"),
    req.files
  )
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

export const testUpload = async (req, res, next) => {
  /*const tempBase64 = [
    {
      name: "video_2023-03-16_15-39-46.mp4",
      mimetype: "video/mp4",
      content:
        "data:video/mp4;base64,"
    }
  ]*/
  const result = await _uploadServices(path.join("feed", "post"), req.files)
  /*const result = await _uploadServices(
    path.join("feed", "update"),
    tempBase64,
    true,
    "cloud_storage"
  )*/

  return res.respond(result)
}

export const testCopyToGCS = async (req, res, next) => {
  const result = await moveFileFromServerToGCS("/modules/feed", "/modules/feed2", "matthias_helvar_by_noukette_dbys4l7-fullview--1-.jpg")

  return res.respond(result)
}

export const testCopy = async (req, res, next) => {
  const pathFrom = path.join("feed", "get")
  const pathTo = path.join("feed", "post")
  const result = await copyFilesServices(pathFrom, pathTo)

  return res.respond(result)
}
