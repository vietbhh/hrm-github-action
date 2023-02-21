import workspaceMongoModel from "../models/workspace.mongo.js"
import path from "path"
import { _localUpload } from "#app/services/upload.js"
import fs from "fs"
const saveWorkspace = async (req, res, next) => {
  const workspace = new workspaceMongoModel({
    name: req.body.workspace_name,
    type: req.body.workspace_type,
    mode: req.body.workspace_mode,
    cover_image: "tttttttttttt",
    members: [req.__user],
    administrators: [req.__user],
    __user: req.__user
  })

  try {
    const saveData = await workspace.save()
    return res.respond(saveData)
  } catch (err) {
    return res.fail(err.message)
  }
}

const getWorkspace = async (req, res, next) => {
  const workspaceId = req.params.workspaceId
  console.log("workspaceId", workspaceId)
  try {
    const workspace = await workspaceMongoModel.findById(workspaceId)
    return res.respond(workspace)
  } catch (err) {
    return res.fail(err.message)
  }
}
const decodeBase64Image = (dataString) => {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {}
  if (matches.length !== 3) {
    return new Error("Invalid input string")
  }

  response.type = matches[1]
  response.data = new Buffer(matches[2], "base64")

  return response
}
const saveCoverImage = async (req, res) => {
  const storePath = path.join("modules", "workspace")
  console.log("storePath", storePath)
  const image = req.body.image
  const base64Buffe = decodeBase64Image(image)
  const imageBinary = base64Buffe.data.toString("binary")
  const type = base64Buffe.type

  const paaaaaaaaaaat = "modules/workspace/" + req.body._id
  const saveImg = _localUpload(paaaaaaaaaaat, [
    { name: "cover-image.png", ...imageBinary }
  ])
  console.log("saveImg", saveImg)
  return
  const paaaaaaaaaaatxxx =
    "E:/project/fridayOs-hrm/Backend/applications/default/writable/uploads/modules/workspace/idtest"
  try {
    fs.writeFileSync(
      paaaaaaaaaaat + "/" + req.body._id + "/anhtesss.png",
      base64Buffe.data,
      "utf8"
    )
  } catch (err) {
    console.error(err)
  }

  return
  const resultUpload = await _localUpload(paaaaaaaaaaat, [
    { data: base64Buffe.data, type: base64Buffe.type }
  ])

  return

  console.log("resultUpload", resultUpload)

  return
  const workspace = new workspaceMongoModel({
    cover_image: req.body?.cover_image
  })
  console.log("workspace", workspace)
  try {
    const saveData = await workspace.updateOne(
      { _id: "63e476e26bb24abaf6482565" },
      { $set: { cover_image: storePath } }
    )
    return res.respond(saveData)
  } catch (err) {
    return res.fail(err.message)
  }
}
export { getWorkspace, saveWorkspace, saveCoverImage }
