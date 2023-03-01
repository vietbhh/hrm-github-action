import workspaceMongoModel from "../models/workspace.mongo.js"
import path from "path"
import { _localUpload } from "#app/services/upload.js"
import fs from "fs"
import { getUsers, usersModel } from "#app/models/users.mysql.js"
import { isEmpty } from "lodash-es"
import { Op } from "sequelize"

const saveWorkspace = async (req, res, next) => {
  const workspace = new workspaceMongoModel({
    name: req.body.workspace_name,
    type: req.body.workspace_type,
    mode: req.body.workspace_mode,
    cover_image: "",
    members: [req.__user],
    administrators: [req.__user],
    __user: req.__user,
    request_joins: []
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
  console.log("req.bodyreq.bodyreq.body", req.body)
  const image = req.body.image
  const base64Buffe = decodeBase64Image(image)
  const imageBinary = base64Buffe.data.toString("binary")
  const type = base64Buffe.type

  const paaaaaaaaaaat = "modules/workspace/" + req.body._id
  const saveImg = _localUpload(paaaaaaaaaaat, [image])
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

const updateWorkspace = async (req, res) => {
  const dataSave = { ...req.body }
  // const infoWS = await workspaceMongoModel.findById(dataSave._id)

  if (dataSave?.members) {
    dataSave.members = JSON.parse(req.body.members)
  }
  console.log("**********req.body", req.body)

  const aaa = await workspaceMongoModel.findByIdAndUpdate(dataSave._id, {
    ...dataSave
  })
  return res.respond(aaa)
}

const getPostWorkspace = async (req, res) => {}

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
    } else if (requestData.hasOwnProperty("update_administrator")) {
      if (requestData.type === "add") {
        const workspaceUpdate = await _handleUpdateWorkspace(
          {
            _id: workspaceId
          },
          {
            $push: {
              administrators: requestData.data.id
            }
          }
        )
        const currentPage = await _getCurrentPageMember(
          requestData,
          workspaceUpdate
        )

        return res.respond({
          data: workspaceUpdate,
          current_page: currentPage
        })
      } else if (requestData.type === "remove") {
        const workspaceUpdate = await _handleUpdateWorkspace(
          {
            _id: workspaceId
          },
          {
            $pull: {
              administrators: requestData.data.id
            }
          }
        )

        return res.respond(workspaceUpdate)
      }
    } else if (requestData.hasOwnProperty("remove_member")) {
      const workspaceUpdate = await _handleUpdateWorkspace(
        {
          _id: workspaceId
        },
        {
          $pull: {
            administrators: requestData.data.id,
            members: requestData.data.id
          }
        }
      )

      const currentPage = await _getCurrentPageMember(
        requestData,
        workspaceUpdate
      )

      return res.respond({
        data: workspaceUpdate,
        current_page: currentPage
      })
    } else if (requestData.hasOwnProperty("approve_join_request")) {
      if (requestData?.is_all === true) {
        const workspace = await workspaceMongoModel.findById(workspaceId)
        const workspaceUpdate = await _handleUpdateWorkspace(
          {
            _id: workspaceId
          },
          {
            $push: {
              members: workspace?.request_joins
            },
            $set: {
              request_joins: []
            }
          }
        )

        return res.respond({
          data: workspaceUpdate
        })
      } else {
        const workspaceUpdate = await _handleUpdateWorkspace(
          {
            _id: workspaceId
          },
          {
            $push: {
              members: requestData.data.id
            },
            $pull: {
              request_joins: requestData.data.id
            }
          }
        )

        let page = requestData?.page === undefined ? 1 : requestData.page
        const limit = requestData?.limit === undefined ? 4 : requestData.limit
        const allRequestJoin =
          workspaceUpdate?.request_joins === undefined
            ? 0
            : await getUsers(workspaceUpdate.request_joins)
        const totalPage = Math.ceil(allRequestJoin.length / limit)
        if (page > totalPage) {
          page = totalPage
        }

        return res.respond({
          data: workspaceUpdate,
          currentPage: page
        })
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

const loadDataMember = async (req, res, next) => {
  const workspaceId = req.params.id
  const text = isEmpty(req.query?.text)
    ? ""
    : req.query.text.trim().length === 0
    ? ""
    : req.query.text

  try {
    const workspace = await workspaceMongoModel.findById(workspaceId)
    let condition = {}
    if (text !== "") {
      condition = {
        username: {
          [Op.like]: `${text}%`
        }
      }
    }
    const isAdmin = workspace.administrators.some(
      (item) => parseInt(item) === parseInt(req.__user)
    )

    if (req.query.is_list_member === "true") {
      const workspaceAdministrator =
        workspace?.administrators === undefined
          ? []
          : workspace.administrators.reverse()
      const administrators = await getUsers(workspaceAdministrator, condition)

      const page = req.query?.page === undefined ? 1 : req.query.page
      const limit = req.query?.limit === undefined ? 30 : req.query.limit
      const listMember =
        workspace?.members === undefined
          ? []
          : workspace.members.reverse().filter((item) => {
              return !workspaceAdministrator.includes(item)
            })

      const allMember =
        listMember.length === 0 ? [] : await getUsers(listMember)
      const members =
        listMember.length === 0
          ? []
          : await getUsers(
              listMember.slice((page - 1) * limit, page * limit),
              condition
            )

      const requestJoin =
        workspace?.request_joins === undefined
          ? []
          : await getUsers(workspace.request_joins.reverse().slice(0, 4))

      return res.respond({
        total_member: members.length + administrators.length,
        members: members,
        total_list_member: allMember.length,
        administrators: administrators,
        request_joins: requestJoin,
        is_admin_group: isAdmin
      })
    } else if (req.query.is_request_join === "true") {
      const page = req.query?.page === undefined ? 1 : req.query.page
      const limit = req.query?.limit === undefined ? 4 : req.query.limit
      const allRequestJoin =
        workspace?.request_joins === undefined
          ? []
          : await getUsers(workspace.request_joins)

      const requestJoin =
        workspace?.request_joins === undefined
          ? []
          : await getUsers(
              workspace.request_joins
                .reverse()
                .slice((page - 1) * limit, page * limit)
            )

      return res.respond({
        total_request_join: allRequestJoin.length,
        request_joins: requestJoin,
        is_admin_group: isAdmin
      })
    }
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

const _getCurrentPageMember = async (requestData, workspace) => {
  const workspaceAdministrator =
    workspace?.administrators === undefined
      ? []
      : workspace.administrators.reverse()
  let page = requestData?.page === undefined ? 1 : requestData.page
  const limit = requestData?.limit === undefined ? 4 : requestData.limit
  const listMember =
    workspace?.members === undefined
      ? []
      : workspace.members.reverse().filter((item) => {
          return !workspaceAdministrator.includes(item)
        })

  const allMember = listMember.length === 0 ? [] : await getUsers(listMember)

  const totalPage = Math.ceil(allMember.length / limit)
  if (page > totalPage) {
    return totalPage
  }

  return page
}

export {
  getWorkspace,
  saveWorkspace,
  getListWorkspace,
  saveCoverImage,
  updateWorkspace,
  sortGroupRule,
  loadDataMember,
  getPostWorkspace
}
