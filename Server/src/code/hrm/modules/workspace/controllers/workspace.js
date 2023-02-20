import workspaceMongoModel from "../models/workspace.mongo.js"
import path from "path"
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
const saveCoverImage = async (req, res) => {
  const storePath = path.join("modules", "workspace")
  console.log("req , req", req)
  console.log("storePath", storePath)
  const image = req.body.image
  const split = image.split(",") // or whatever is appropriate here. this will work for the example given
  const base64string = split[1]
  const buffer = Buffer.from(base64string, "base64")

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
