import workspaceMongoModel from "../models/workspace.mongo.js"

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
  try {
    const workspace = await workspaceMongoModel.findById(workspaceId)
    return res.respond(workspace)
  } catch (err) {
    return res.fail(err.message)
  }
}
const saveCoverImage = async (req, res) => {
  console.log("reqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq", req.body)
  console.log("res", res)
}

const getListWorkspace = async (req, res, next) => {
  const page = req.query.page === 1 ? 0 : req.query.page - 1
  const limit = req.query.limit
  const workspaceType = req.query.workspace_type
  try {
    const filter = {}
    if (workspaceType === "joined") {
      filter["members"] = parseInt(req.__user)
    } else if (workspaceType === "managed") {
      filter["administrators"] = parseInt(req.__user)
    }

    const workspace = await workspaceMongoModel
      .find(filter)
      .limit(limit)
      .skip(limit * page)
      .sort({
        _id: "desc"
      })

    const totalWorkspace = await workspaceMongoModel.find(filter)

    return res.respond({
      results: workspace,
      total_page: Math.ceil(totalWorkspace.length / limit)
    })
  } catch (err) {
    return res.fail(err.message)
  }
}

const updateWorkspace = async (req, res, next) => {
  const workspaceId = req.params.id
  
  try {
    const workspace = await workspaceMongoModel.findOneAndUpdate(
      {
        _id: workspaceId
      },
      {
        introduction: req.body.introduction
      }
    )
    return res.respond(workspace)
  } catch (err) {
    return res.fail(err.message)
  }
}

export {
  getWorkspace,
  saveWorkspace,
  getListWorkspace,
  saveCoverImage,
  updateWorkspace
}
