import workspaceMongoModel from "../models/workspace.mongo.js"

const saveWorkspace = async (req, res, next) => {
  const workspace = new workspaceMongoModel({
    name: req.body.workspace_name,
    type: req.body.workspace_type,
    mode: req.body.workspace_mode,
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
  try {
    const workspace = await workspaceMongoModel.findById(workspaceId)
    return res.respond(workspace)
  } catch (err) {
    return res.fail(err.message)
  }
}

export { getWorkspace, saveWorkspace }
