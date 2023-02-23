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
    const isAdmin = workspace.administrators.some(
      (item) => parseInt(item) === parseInt(req.__user)
    )
    
    return res.respond({ ...workspace._doc, is_admin_group: isAdmin })
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
  const requestData = req.body
  try {
    if (requestData.hasOwnProperty("group_rule_id")) {
      if (requestData.type === "update") {
        const workspace = await _handleUpdateWorkspace(
          {
            _id: workspaceId,
            "group_rules._id": requestData.group_rule_id
          },
          {
            $set: {
              "group_rules.$": {
                ...requestData.data
              }
            }
          }
        )

        return res.respond([...workspace.group_rules])
      } else if (requestData.type === "remove") {
        const workspace = await _handleUpdateWorkspace(
          {
            _id: workspaceId
          },
          {
            $pull: {
              group_rules: {
                _id: requestData.group_rule_id
              }
            }
          }
        )

        return res.respond([...workspace.group_rules])
      }
    }

    const condition = {
      _id: workspaceId
    }
    const workspace = await _handleUpdateWorkspace(condition, requestData)
    return res.respond(workspace)
  } catch (err) {
    return res.fail(err.message)
  }
}

const sortGroupRule = async (req, res, next) => {
  const workspaceId = req.params.id
  const index = req.body.index
  const sortType = req.body.sort_type
  try {
    const workspace = await workspaceMongoModel.findById(workspaceId)
    const nextIndex = sortType === "down" ? index + 1 : index - 1
    const groupRule = arrayMove([...workspace["group_rules"]], index, nextIndex)

    await _handleUpdateWorkspace(
      {
        _id: workspaceId
      },
      {
        $set: { group_rules: groupRule }
      }
    )

    return res.respond(groupRule)
  } catch (err) {
    return res.fail(err.message)
  }
}

const _handleUpdateWorkspace = (condition, dataUpdate) => {
  return workspaceMongoModel.findOneAndUpdate(condition, dataUpdate, {
    new: true
  })
}

const arrayMove = (arr, oldIndex, newIndex) => {
  if (newIndex >= arr.length) {
    const k = newIndex - arr.length + 1
    while (k--) {
      arr.push(undefined)
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0])
  return arr
}

export {
  getWorkspace,
  saveWorkspace,
  getListWorkspace,
  saveCoverImage,
  updateWorkspace,
  sortGroupRule
}
