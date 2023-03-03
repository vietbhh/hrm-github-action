import workspaceMongoModel from "../models/workspace.mongo.js"
import feedMongoModel from "../../feed/models/feed.mongo.js"
import path from "path"
import { _localUpload } from "#app/services/upload.js"
import fs from "fs"
import { getUser, usersModel } from "#app/models/users.mysql.js"
import { isEmpty, map } from "lodash-es"
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

const updateWorkspaceOLD = async (req, res) => {
  const dataSave = { ...req.body }
  // const infoWS = await workspaceMongoModel.findById(dataSave._id)

  if (dataSave?.members) {
    dataSave.members = JSON.parse(req.body.members)
  }

  const update = await workspaceMongoModel.findByIdAndUpdate(dataSave._id, {
    ...dataSave
  })
  return res.respond(update)
}

const getPostWorkspace = async (req, res) => {
  try {
    const arr = []

    const postList = await feedMongoModel
      .find({ permission: "workspace", approve_status: "pending" })
      .sort({
        _id: "desc"
      })
    map(postList, async (index, key) => {
      const postData = { ...index }
      const info_created = await getUser(index.created_by)
      postData._doc.user_data = info_created.dataValues //info_created.dataValues
      arr.push(postData._doc)
    })

    return res.respond({
      results: arr
    })
  } catch (err) {
    return res.fail(err.message)
  }
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

const _handleUpdateGroupRule = (workspace, requestData) => {
  const groupRule =
    workspace?.group_rules === undefined ? [] : workspace.group_rules
  if (requestData.type === "update") {
    return {
      ...workspace._doc,
      group_rules: groupRule.map((item) => {
        if (item._id.equals(requestData.group_rule_id)) {
          return {
            _id: requestData.group_rule_id,
            ...requestData.data
          }
        }

        return item
      })
    }
  } else if (requestData.type === "remove") {
    return {
      ...workspace._doc,
      group_rules: groupRule.filter((item) => {
        return item._id !== requestData.group_rule_id
      })
    }
  }
}

const _handleUpdateAdministrator = (workspace, requestData) => {
  let administrators =
    workspace?.administrators === undefined ? [] : workspace.administrators
  if (requestData.type === "add") {
    return {
      ...workspace._doc,
      administrators: [...workspace.administrators, requestData.data.id]
    }
  } else if (requestData.type === "remove") {
    return {
      ...workspace._doc,
      administrators: administrators.filter((item) => {
        return item !== requestData.data.id
      })
    }
  }
}

const _handleRemoveMember = (workspace, requestData) => {
  const administrators =
    workspace?.administrators === undefined
      ? []
      : workspace.administrators.filter((item) => {
          return item !== requestData.data.id
        })

  const members =
    workspace?.members === undefined
      ? []
      : workspace.members.filter((item) => {
          return item !== requestData.data.id
        })

  return { ...workspace._doc, administrators: administrators, members: members }
}
const _handleApproveJoinRequest = (workspace, requestData) => {
  if (requestData.is_all === true) {
    const requestJoins =
      workspace?.request_joins === undefined ? [] : workspace.request_joins
    return {
      ...workspace._doc,
      members: [...workspace.members, ...requestJoins],
      request_joins: []
    }
  } else {
    return {
      ...workspace._doc,
      members:
        workspace?.members === undefined
          ? [requestData.data.id]
          : [...workspace.members, requestData.data.id],
      request_joins:
        workspace?.request_joins === undefined
          ? []
          : workspace.request_joins.filter((item) => {
              return parseInt(item) !== parseInt(requestData.data.id)
            })
    }
  }
}

const updateWorkspace = async (req, res, next) => {
  const workspaceId = req.params.id
  if (!workspaceId.match(/^[0-9a-fA-F]{24}$/)) {
    res.fail("invalid_work_space_id")
  }

  const requestData = req.body
  try {
    const workspaceInfo = await workspaceMongoModel.findById(workspaceId)
    if (workspaceInfo === null) {
      res.failNotFound("work_space_not_found")
    }

    let workSpaceUpdate = {}
    let returnCurrentPageForPagination = ""
    let returnNewWorkspaceAfterUpdate = false

    if (requestData.hasOwnProperty("group_rule_id")) {
      workSpaceUpdate = _handleUpdateGroupRule(workspaceInfo, requestData)
      returnCurrentPageForPagination = ""
    } else if (requestData.hasOwnProperty("update_administrator")) {
      workSpaceUpdate = _handleUpdateAdministrator(workspaceInfo, requestData)
      returnCurrentPageForPagination = requestData.type === "members"
    } else if (requestData.hasOwnProperty("remove_member")) {
      workSpaceUpdate = _handleRemoveMember(workspaceInfo, requestData)
      returnCurrentPageForPagination = "members"
    } else if (requestData.hasOwnProperty("approve_join_request")) {
      workSpaceUpdate = _handleApproveJoinRequest(workspaceInfo, requestData)
      returnCurrentPageForPagination =
        requestData.is_all === false ? "request_join" : ""
    } else if (requestData.hasOwnProperty("add_new_group")) {
      workSpaceUpdate = {
        ...workspaceInfo._doc,
        group_rules: requestData.group_rules
      }
      returnNewWorkspaceAfterUpdate = true
    } else {
      workSpaceUpdate = {
        ...workspaceInfo._doc,
        ...requestData
      }
      returnCurrentPageForPagination = ""
    }

    if (
      returnCurrentPageForPagination !== "" ||
      returnNewWorkspaceAfterUpdate
    ) {
      const updateData = { ...workSpaceUpdate }
      delete updateData._id
      const newWorkspace = await workspaceMongoModel.findOneAndUpdate(
        {
          _id: workspaceId
        },
        { $set: { ...updateData } },
        {
          new: returnNewWorkspaceAfterUpdate
        }
      )

      if (returnNewWorkspaceAfterUpdate) {
        return res.respond(newWorkspace)
      }

      let currentPage = 1
      if (returnCurrentPageForPagination === "members") {
        currentPage = await _getCurrentPageMember(requestData, workSpaceUpdate)
      } else if (returnCurrentPageForPagination === "request_join") {
        currentPage = await _getCurrentPageRequestJoin(
          requestData,
          workSpaceUpdate
        )
      }

      return res.respond({
        data: workSpaceUpdate,
        current_page: currentPage
      })
    } else {
      const updateData = { ...workSpaceUpdate }
      delete updateData._id
      await workspaceMongoModel.updateOne(
        {
          _id: workspaceId
        },
        { ...updateData }
      )

      return res.respond(workSpaceUpdate)
    }
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

    if (req.query.load_list === "all") {
      const pageAdmin = req.query?.a_page === undefined ? 1 : req.query.a_page
      const limitAdmin =
        req.query?.a_limit === undefined ? 30 : req.query.a_limit
      const workspaceAdministrator =
        workspace?.administrators === undefined
          ? []
          : workspace.administrators.reverse()
      const allAdmin =
        workspaceAdministrator.length === 0
          ? []
          : await getUsers(workspace.administrators)
      const administrators =
        workspaceAdministrator.length === 0
          ? []
          : await getUsers(
              workspaceAdministrator.slice(
                (pageAdmin - 1) * limitAdmin,
                pageAdmin * limitAdmin
              ),
              condition
            )

      const page = req.query?.m_page === undefined ? 1 : req.query.m_page
      const limit = req.query?.m_limit === undefined ? 30 : req.query.m_limit
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
        total_list_admin: allAdmin.length,
        request_joins: requestJoin,
        is_admin_group: isAdmin
      })
    } else if (req.query.load_list === "request_join") {
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
  return
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
  const page = requestData?.page === undefined ? 1 : requestData.page
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

const _getCurrentPageAdmin = async (requestData, workspace) => {
  const page = requestData?.page === undefined ? 1 : requestData.page
  const limit = requestData?.limit === undefined ? 4 : requestData.limit
  const allAdmin =
    workspace?.administrators === undefined
      ? []
      : await getUsers(workspace.administrators)
  const totalPage = Math.ceil(allAdmin.length / limit)
  if (page > totalPage) {
    return totalPage
  }

  return page
}

const _getCurrentPageRequestJoin = async (requestData, workspace) => {
  const page = requestData?.page === undefined ? 1 : requestData.page
  const limit = requestData?.limit === undefined ? 4 : requestData.limit
  const allRequestJoin =
    workspace?.request_joins === undefined
      ? []
      : await getUsers(workspace.request_joins)
  const totalPage = Math.ceil(allRequestJoin.length / limit)
  if (page > totalPage) {
    return totalPage
  }

  return page
}
const approvePost = async (req, res) => {
  try {
    console.log("req.body?.id", req.body?.id)
    const feedUpdate = await feedMongoModel.findByIdAndUpdate(req.body?.id, {
      ...req.body
    })
    return res.respond(feedUpdate)
  } catch {
    return res.fail(err.message)
  }
}
export {
  getWorkspace,
  saveWorkspace,
  getListWorkspace,
  saveCoverImage,
  updateWorkspace,
  sortGroupRule,
  loadDataMember,
  getPostWorkspace,
  approvePost
}
