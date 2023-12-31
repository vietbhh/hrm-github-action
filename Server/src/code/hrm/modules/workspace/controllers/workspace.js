import workspaceMongoModel from "../models/workspace.mongo.js"
import feedMongoModel from "../../feed/models/feed.mongo.js"
import { isEmpty, forEach, map, isArray, isObject } from "lodash-es"
import path, { dirname } from "path"
import { _uploadServices } from "#app/services/upload.js"
import {
  getUsers,
  usersModel,
  getUser,
  getUserActivated
} from "#app/models/users.mysql.js"
import { Op } from "sequelize"
import { handleDataBeforeReturn } from "#app/utility/common.js"
import { Storage } from "@google-cloud/storage"
import moment from "moment/moment.js"
import { sendNotification } from "#app/libraries/notifications/Notifications.js"
import { handleDataLoadFeed } from "../../feed/controllers/feed.js"
import {
  handleAddNewGroupToFireStore,
  handleAddMemberToFireStoreGroup,
  handleRemoveMemberFromFireStoreGroup
} from "#app/libraries/chat/Chat.js"
import {
  sendNotificationRequestJoin,
  sendNotificationApproveJoin,
  sendNotificationApprovePost,
  sendNotificationNewPost,
  sendNotificationAddMember,
  sendNotificationAddMemberWaitApproval,
  sendNotificationHasNewMember,
  sendNotificationKickMember,
  sendNotificationAssignedAdmin
} from "./notification.js"

const _saveWorkspace = async (
  saveData,
  createChatGroup = false,
  members = [],
  admin = [],
  user
) => {
  const dataSave = {
    members: [],
    ...saveData,
    administrators: admin,
    __user: user
  }

  const joined_time = moment().toISOString()
  for (const item of members) {
    dataSave.members = [
      ...dataSave.members,
      {
        id_user: item,
        joined_at: joined_time
      }
    ]
  }

  try {
    if (createChatGroup === "true" || createChatGroup === true) {
      const groupChatId = await handleAddNewGroupToFireStore(
        user,
        dataSave.name,
        members,
        true
      )
      dataSave["group_chat_id"] = groupChatId
    }
    const workspace = new workspaceMongoModel(dataSave)
    await workspace.save()
    return workspace
  } catch (err) {
    throw new Error(err)
  }
}

const saveWorkspace = async (req, res, next) => {
  const dataSave = {
    name: req.body.workspace_name,
    type: req.body.workspace_type,
    mode: req.body.workspace_mode,
    description: req.body?.description,
    cover_image: "",
    members: [
      {
        id_user: req.__user,
        joined_at: moment().toISOString()
      }
    ],
    administrators: [req.__user],
    __user: req.__user,
    request_joins: []
  }

  try {
    const userString = req.__user.toString()
    const workspace = await _saveWorkspace(
      dataSave,
      req.body.workspace_crate_group_chat,
      [],
      [userString],
      userString
    )
    if (req.body?.image !== undefined && req.body.image !== "") {
      await _handleUploadImage(req.body.image, workspace._id)
    }
    return res.respond(workspace)
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

    // count total member in workspace
    const user = await getUserActivated(); 

    const membersWithIdUser = workspace.members.filter(member => {
      return user.some(u => u.id == member.id_user);
    });

    const memberCountWithIdUser = membersWithIdUser.length;
    // End count total member in workspace

    const postList = await feedMongoModel
      .find({
        permission_ids: workspaceId,
        permission: "workspace",
        approve_status: "pending"
      })
      .count()

    return res.respond({
      ...workspace._doc,
      is_admin_group: isAdmin,
      pending_post: postList,
      total_member: memberCountWithIdUser
    })
  } catch (err) {
    return res.fail(err.message)
  }
}

const saveCoverImage = async (req, res) => {
  const image = req.body.image
  try {
    const update = await _handleUploadImage(image, req.body._id)

    return res.respond(update)
  } catch (err) {
    return res.fail(err.message)
  }
}

const _handleUploadImage = async (image, id) => {
  const imageFile = {}
  imageFile.content = image
  imageFile.name = id + "_" + Date.now() + "_cover.png"
  const pathUpload = "modules/workspace/" + id
  const uploadPath = await _uploadServices(pathUpload, [imageFile], true)
  const newImagePath = uploadPath.uploadSuccess[0]?.path
  await workspaceMongoModel.findOneAndUpdate(
    { _id: id },
    { $set: { cover_image: newImagePath } }
  )

  return newImagePath
}

const removeCoverImage = async (req, res) => {
  const id = req.body._id
}

const addMemberByDepartment = async (req, res) => {
  const dataSave = { ...req.body }
  // const infoWS = await workspaceMongoModel.findById(dataSave._id)
  if (dataSave.departments) {
    //console.log("data", JSON.parse(dataSave.departments))
  }

  return 1
}

const getPostWorkspace = async (req, res) => {
  try {
    const filter = {
      permission_ids: req.query.id,
      permission: "workspace",
      approve_status: "pending",
      content: { $ne: "" }
    }
    if (req.query?.search) {
      filter.content = { $regex: new RegExp(req.query?.search) }
    }

    const pageLength = req.query.pageLength
    const skip = req.query.page <= 1 ? 0 : req.query.page * pageLength
    const postList = await feedMongoModel
      .find(filter)
      .skip(skip)
      .limit(pageLength)
      .sort({
        _id: req.query.sort
      })
    const beforeReturn = await handleDataBeforeReturn(postList, true)
    const feedCount = await feedMongoModel.find(filter).count()
    return res.respond({
      results: beforeReturn,
      recordsTotal: feedCount
    })
  } catch (err) {
    return res.fail(err.message)
  }
}

const getUserWorkspaceIds = async (userId) => {
  const filter = { "members.id_user": parseInt(userId) }
  const workspaces = await workspaceMongoModel.find(filter)
  const idWorkspace = []
  for (const item of workspaces) {
    idWorkspace.push(item._id)
  }
  return idWorkspace
}

const getListWorkspace = async (req, res, next) => {
  const page = req.query.page === 1 ? 0 : req.query.page - 1
  const limit = req.query.limit
  const workspaceType = req.query.workspace_type
  const status = req.query.status
  const text = req.query.text === undefined ? "" : req.query.text
  const userId = isEmpty(req.query.user_id) ? req.__user : req.query.user_id
  const queryType = req.query.query_type

  try {
    let filter = {}
    if (workspaceType === "joined" || workspaceType === "both") {
      filter = { "members.id_user": parseInt(userId) }
    } else if (workspaceType === "managed") {
      filter = { administrators: parseInt(userId) }
    }
    if (status !== undefined && status !== "" && status !== "all") {
      filter["status"] = status
    }

    if (text.trim().length > 0) {
      filter["name"] = {
        $regex: text + ".*"
      }
    }

    let workspace = []
    if (limit === 0) {
      workspace = await workspaceMongoModel
        .find(filter)
        .limit(limit)
        .skip(limit * page)
        .sort({
          _id: "desc"
        })
    } else {
      workspace = await workspaceMongoModel
        .find(filter)
        .limit(limit)
        .skip(limit * page)
        .sort({
          _id: "desc"
        })
    }
    const totalWorkspace = await workspaceMongoModel.find(filter)
    const result = await handleDataBeforeReturn(workspace, true)

    const idWorkspace = []
    result.map((item, index) => {
      idWorkspace.push(item._id)
      if (result[index]["post_created"] === undefined) {
        result[index]["post_created"] = 0
      }

      result[index]["total_member"] = Array.isArray(item.members)
        ? item.members.length
        : 0

      result[index]["is_admin_group"] = Array.isArray(item.administrators)
        ? item.administrators.includes(userId)
        : false
    })

    if (queryType === "activity") {
      const listFeed = await feedMongoModel.find({
        permission: "workspace",
        permission_ids: { $in: idWorkspace }
      })

      listFeed.map((feedItem) => {
        const workspacePermissionId = feedItem.permission_ids
        workspacePermissionId.map((itemPermissionId) => {
          result.map((itemResult, index) => {
            if (itemPermissionId.includes(itemResult._id.toString())) {
              result[index]["post_created"] += 1
            }
          })
        })
      })
    }

    const returnData = await _handleWorkspaceData(result)

    return res.respond({
      results: returnData,
      total_data: totalWorkspace.length,
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
        return item._id.toString() !== requestData.group_rule_id
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
          return parseInt(item) !== parseInt(requestData.member_id)
        })

  const members =
    workspace?.members === undefined
      ? []
      : workspace.members.filter((item) => {
          return parseInt(item.id_user) !== parseInt(requestData.member_id)
        })
  return { ...workspace._doc, administrators: administrators, members: members }
}

const _handleApproveJoinRequest = (workspace, requestData) => {
  if (requestData.is_all === "true" || requestData.is_all === true) {
    const requestJoins =
      workspace?.request_joins === undefined ? [] : workspace.request_joins
    const arrMemberJoin = requestJoins.map((item) => {
      return {
        id_user: item.id_user,
        joined_at: moment().toISOString()
      }
    })

    return {
      ...workspace._doc,
      members: [...workspace.members, ...arrMemberJoin],
      request_joins: []
    }
  } else {
    return {
      ...workspace._doc,
      members:
        workspace?.members === undefined
          ? [
              {
                id_user: requestData.member_id,
                joined_at: moment().toISOString()
              }
            ]
          : [
              ...workspace.members,
              {
                id_user: requestData.member_id,
                joined_at: moment().toISOString()
              }
            ],
      request_joins:
        workspace?.request_joins === undefined
          ? []
          : workspace.request_joins.filter((item) => {
              return parseInt(item.id_user) !== parseInt(requestData.member_id)
            })
    }
  }
}

const handleDeclineJoinRequest = (workspace, requestData) => {
  if (requestData.is_all === true || requestData.is_all === "true") {
    return {
      ...workspace._doc,
      request_joins: []
    }
  } else {
    return {
      ...workspace._doc,
      request_joins:
        workspace?.request_joins === undefined
          ? []
          : workspace.request_joins.filter((item) => {
              return parseInt(item.id_user) !== parseInt(requestData.member_id)
            })
    }
  }
}

const updateWorkspace = async (req, res, next) => {
  const workspaceId = req.params.id
  if (!workspaceId.match(/^[0-9a-fA-F]{24}$/)) {
    res.fail("invalid_work_space_id")
  }

  const sender = await getUser(req.__user)
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
      requestData.data = JSON.parse(requestData.data)
      workSpaceUpdate = _handleUpdateAdministrator(workspaceInfo, requestData)
      returnCurrentPageForPagination = requestData.type === "members"
      sendNotificationAssignedAdmin(workspaceInfo, sender, requestData.data?.id)
    } else if (requestData.hasOwnProperty("remove_member")) {
      workSpaceUpdate = _handleRemoveMember(workspaceInfo, requestData)
      returnCurrentPageForPagination = "members"
      sendNotificationKickMember(workspaceInfo, sender, [requestData.member_id])
    } else if (requestData.hasOwnProperty("approve_join_request")) {
      workSpaceUpdate = _handleApproveJoinRequest(workspaceInfo, requestData)
      let receivers = requestData.member_id
      if (requestData.is_all === true || requestData.is_all === "true") {
        const request_joins = workspaceInfo.request_joins
        receivers = request_joins.map((x) => x["id_user"])
      }
      sendNotificationApproveJoin(
        workspaceInfo,
        "Approved",
        receivers,
        req.__user
      )
      returnCurrentPageForPagination =
        requestData.is_all === false ? "request_join" : ""
    } else if (requestData.hasOwnProperty("decline_join_request")) {
      workSpaceUpdate = handleDeclineJoinRequest(workspaceInfo, requestData)
      let receivers = requestData.member_id
      if (requestData.is_all === true || requestData.is_all === "true") {
        const request_joins = workspaceInfo.request_joins
        receivers = request_joins.map((x) => x["id_user"])
      }
      sendNotificationApproveJoin(
        workspaceInfo,
        "Declined",
        receivers,
        req.__user
      )

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
      const sender = await getUser(req.__user)
      const updateData = { ...workSpaceUpdate }
      delete updateData._id
      if (requestData?.members) {
        const arrMember =
          typeof requestData.members === "string"
            ? JSON.parse(requestData.members)
            : requestData.members

        const newMember = []
        arrMember.map((item) => {
          if (!item?._id) {
            newMember.push(item.id_user)
          }
        })

        updateData.members = arrMember.map((item) => {
          if (item?._id === undefined) {
            return {
              ...item,
              joined_at: moment().toISOString()
            }
          }

          return item
        })
        if (newMember.length > 0) {
          updateData.id = workspaceId
          sendNotificationAddMember(updateData, sender, newMember)
          // for admin
          const handleMember = await getUsers(newMember)

          const handleMemberMap = handleMember.map((item) => {
            return {
              id: item.dataValues.id,
              full_name: item.dataValues.full_name,
              username: item.dataValues.username,
              email: item.dataValues.email,
              phone: item.dataValues.phone
            }
          })
          const adminExist = [...updateData.administrators].filter(
            (item) => item != req.__user
          )
          if (adminExist) {
            sendNotificationHasNewMember(
              updateData,
              handleMemberMap,
              adminExist,
              sender
            )
          }
        }
      }
      if (requestData?.administrators) {
        updateData.administrators =
          typeof requestData.administrators === "string"
            ? JSON.parse(requestData.administrators)
            : requestData.administrators
      }
      if (requestData?.pinPosts) {
        updateData.pinPosts =
          typeof requestData.pinPosts === "string"
            ? JSON.parse(requestData.pinPosts)
            : requestData.pinPosts
      }
      if (requestData?.request_joins) {
        const requestJoinData =
          typeof requestData.request_joins === "string"
            ? JSON.parse(requestData.request_joins)
            : requestData.request_joins
        const newMember = []
        requestJoinData.map((item) => {
          if (!item?._id) {
            newMember.push(item.id_user)
          }
        })
        updateData.request_joins = requestJoinData.map((item) => {
          if (item?._id === undefined) {
            return {
              ...item,
              requested_at: moment().toISOString()
            }
          }

          return item
        })

        // sent a request to join the workspace
        if (updateData?.membership_approval !== "auto") {
          updateData.id = workspaceId
          sendNotificationRequestJoin(updateData)
          sendNotificationAddMemberWaitApproval(updateData, sender, newMember)
          delete updateData.id
        }
      }
      if (requestData?.notification) {
        updateData.notification =
          typeof requestData.notification === "string"
            ? JSON.parse(requestData.notification)
            : requestData.notification
      }
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
  const data = req.body.data
  try {
    const groupRule = data

    await workspaceMongoModel.findOneAndUpdate(
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
  const text = req.query.text === undefined ? "" : req.query.text

  try {
    const workspace = await workspaceMongoModel.findById(workspaceId)
    let condition = {}
    if (text.trim().length > 0) {
      condition = {
        full_name: {
          [Op.like]: `%${text}%`
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
    } else if (req.query.load_list === "member") {
      const page = req.query?.page === undefined ? 1 : req.query.page
      const limit = req.query?.limit === undefined ? 30 : req.query.limit
      const workspaceMember =
        workspace?.members === undefined || workspace?.members === null
          ? []
          : workspace?.members

      const listMember = workspaceMember.reverse().map((item) => {
        return item.id_user
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
      const handledData = handleMemberData(members, workspaceMember)
      return res.respond({
        total_member: allMember.length,
        members: handledData,
        total_list_member: allMember.length
      })
    } else if (req.query.load_list === "admin") {
      const pageAdmin = req.query?.page === undefined ? 1 : req.query.page
      const limitAdmin = req.query?.limit === undefined ? 30 : req.query.limit
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

      const result = administrators.map((item) => {
        return {
          id: item.dataValues.id,
          full_name: item.dataValues.full_name,
          username: item.dataValues.username,
          email: item.dataValues.email,
          phone: item.dataValues.phone
        }
      })

      return res.respond({
        administrators: result,
        total_list_admin: allAdmin.length
      })
    } else if (req.query.load_list === "request_join") {
      const order = req.query.order === undefined ? "desc" : req.query.order

      if (!isAdmin) {
        return res.respond({
          total_request_join: 0,
          request_joins: [],
          is_admin_group: isAdmin
        })
      }

      if (
        workspace?.request_joins === undefined ||
        workspace.request_joins === null ||
        (isArray(workspace.request_joins) &&
          workspace.request_joins.length === 0)
      ) {
        return res.respond({
          total_request_join: 0,
          request_joins: [],
          is_admin_group: isAdmin
        })
      }

      const idUserRequestJoin = workspace.request_joins.map((item) => {
        return item.id_user
      })

      const allRequestJoin =
        idUserRequestJoin.length === 0
          ? []
          : await getUsers(idUserRequestJoin, condition)

      const result = allRequestJoin.map((item) => {
        const [infoRequestJoin] = workspace.request_joins.filter(
          (itemFilter) => {
            return parseInt(itemFilter.id_user) === parseInt(item.id)
          }
        )

        return {
          ...item.dataValues,
          requested_at: infoRequestJoin?.requested_at
        }
      })

      return res.respond({
        total_request_join: allRequestJoin.length,
        request_joins: order === "desc" ? result.reverse() : result,
        is_admin_group: isAdmin
      })
    }
  } catch (err) {
    return res.fail(err.message)
  }
}

const handleMemberData = (listMember, workspaceMember) => {
  const newData = listMember.map((item) => {
    const newItem = {
      id: item.dataValues.id,
      full_name: item.dataValues.full_name,
      username: item.dataValues.username,
      email: item.dataValues.email,
      phone: item.dataValues.phone
    }
    const [workspaceDataUser] = workspaceMember.filter((itemFilter) => {
      return parseInt(itemFilter.id_user) === parseInt(newItem.id)
    })

    return {
      ...newItem,
      joined_at: workspaceDataUser?.joined_at
        ? workspaceDataUser?.joined_at
        : ""
    }
  })

  return newData
}

const loadDataMedia = async (req, res, next) => {
  const workspaceId = req.params.id
  const mediaTypeNumber = req.query.media_type
  const page = req.query.page
  const pageLength = req.query.page_length
  const owner = req.query?.owner === undefined ? req.__user : req.query.owner

  if (isEmpty(workspaceId) || isEmpty(mediaTypeNumber)) {
    return res.fail("missing_workspace_id_or_media_type")
  }

  if (workspaceId !== "user" && !workspaceId.match(/^[0-9a-fA-F]{24}$/)) {
    res.fail("invalid_work_space_id")
  }

  try {
    const requestMedia = _getMediaType(parseInt(mediaTypeNumber))

    let feedCondition = {}
    let postCondition = {}
    if (workspaceId !== "user") {
      const workspace = await workspaceMongoModel.findById(workspaceId)
      if (workspace === null) {
        res.failNotFound("work_space_not_found")
      }

      feedCondition = {
        permission: "workspace",
        permission_ids: workspaceId,
        type: requestMedia
      }

      postCondition = {
        permission: "workspace",
        permission_ids: workspaceId,
        type: "post"
      }
    } else {
      feedCondition = {
        type: requestMedia
      }

      postCondition = {
        type: "post"
      }
    }

    const listFeed = await feedMongoModel
      .find(feedCondition)
      .skip(page * pageLength)
      .limit(pageLength)
      .sort({
        _id: "desc"
      })

    const totalFeed = await feedMongoModel.find(feedCondition).count()

    const result = []
    const allUser = await usersModel.findAll({ raw: true })
    const postId = []
    listFeed.map((item) => {
      const [userInfo] = allUser.filter(
        (itemFilter) => parseInt(itemFilter.id) === parseInt(item.owner)
      )
      const pushItem = {
        _id: item.id,
        owner: item.owner,
        link: item.link,
        type: item.type,
        ref: item.ref,
        source: item.source,
        source_attribute: item.source_attribute,
        thumb: item.thumb,
        thumb_attribute: item.thumb_attribute,
        created_at: item.created_at,
        owner_info: {
          id: userInfo.id,
          username: userInfo.username,
          avatar: userInfo.avatar,
          email: userInfo.email,
          full_name: userInfo.full_name
        }
      }

      result.push(pushItem)

      if (item.ref !== null && !postId.includes(item.ref)) {
        postId.push(item.ref)
      }
    })

    postCondition["_id"] = postId
    const postData = await feedMongoModel.find(postCondition)

    return res.respond({
      result: result,
      total_feed: totalFeed,
      page: page * 1 + 1,
      has_more: (page * 1 + 1) * pageLength < totalFeed,
      post_data: postData
    })
  } catch (err) {
    return res.fail(err.message)
  }
}

const _handleUpdateWorkspace = (condition, dataUpdate) => {
  return
}

const _getMediaType = (mediaTypeNumber) => {
  if (mediaTypeNumber === 1) {
    return "image"
  } else if (mediaTypeNumber === 2) {
    return "video"
  } else if (mediaTypeNumber === 3) {
    return "file"
  } else if (mediaTypeNumber === 4) {
    return "link"
  }

  return ""
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
    const idWorkspace = req.body.idWorkspace
    delete req.body.idWorkspace

    const infoWorkSpace = await workspaceMongoModel.findById(idWorkspace)
    if (req.body?.all) {
      delete req.body.all

      if (infoWorkSpace) {
        const feedUpdate = await feedMongoModel.updateMany(
          { permission_ids: { $in: req.body?.id }, approve_status: "pending" },
          {
            ...req.body
          }
        )
        return res.respond(feedUpdate)
      }

      const feedUpdate = await feedMongoModel.updateMany(
        { permission: "default", approve_status: "pending" },
        {
          ...req.body
        }
      )
      return res.respond(feedUpdate)
    }
    const feedUpdate = await feedMongoModel.findOneAndUpdate(
      { _id: req.body?.id },
      { ...req.body },
      { new: true }
    )
    const data = await handleDataBeforeReturn(feedUpdate)
    const sender = await getUser(req.__user)
    if (data) {
      sendNotificationApprovePost(
        infoWorkSpace,
        data,
        data?.approve_status,
        data?.created_by?.id,
        sender.dataValues
      )

      if (data?.approve_status === "approved" && infoWorkSpace) {
        const NOT_notification = infoWorkSpace.notification.map((i) => {
          if (i.status === "off") {
            return parseInt(i.id_user)
          }
        })
        // add created_by
        NOT_notification.push(parseInt(data?.created_by?.id))
        // add id approval
        NOT_notification.push(parseInt(req.__user))

        const members = infoWorkSpace.members.map((i) => parseInt(i.id_user))
        const idSendNotification = members.filter(
          (i) => !NOT_notification.includes(i)
        )
        sendNotificationNewPost(infoWorkSpace, data, idSendNotification)
      }
    }
    return res.respond(feedUpdate)
  } catch (err) {
    return res.fail(err.message)
  }
}

const loadFeed = async (req, res) => {
  const request = req.query
  const page = request.page
  const pageLength = request.pageLength
  const textFilter = request?.text === undefined ? "" : request.text
  const filter = {
    permission_ids: req.query.workspace,
    approve_status: "approved",
    ref: null
  }

  if (textFilter.trim().length > 0) {
    filter["content"] = { $regex: textFilter, $options: "i" }
  }

  const feed = await feedMongoModel
    .find(filter)
    .skip(page * pageLength)
    .limit(pageLength)
    .sort({
      order: -1
    })
  const feedCount = await feedMongoModel.find(filter).count()
  const result = await handleDataLoadFeed(page, pageLength, feed, feedCount)
  return res.respond(result)
}

const loadPinned = async (req, res) => {
  const request = req.query
  const workspaceId = request.id
  const textFilter = request?.text === undefined ? "" : request.text
  const workspace = await workspaceMongoModel.findById(workspaceId)
  const arrID = workspace.pinPosts // .map((x) => x.post)

  let dataPost = []
  await Promise.all(
    map(arrID, async (item, key) => {
      const infoPost = await feedMongoModel.findById(item.post)
      infoPost.stt = item.stt
      dataPost.push({ ...infoPost._doc, stt: item.stt })
    })
  )

  const feed = await feedMongoModel.find({
    _id: { $in: arrID }
  })
  const data = await handleDataBeforeReturn(dataPost, true)
  const feedCount = await feedMongoModel
    .find({
      _id: { $in: arrID }
    })
    .count()
  const result = {
    dataPost: data.sort((a, b) => a.stt - b.stt),
    totalPost: feedCount
  }
  return res.respond(result)
}
const loadGCSObjectLink = async (req, res) => {
  const storage = new Storage({
    keyFilename: path.join(
      dirname(global.__basedir),
      "Server",
      "service_account_file.json"
    ),
    //projectId: process.env.GCS_PROJECT_ID
    projectId: "friday-351410"
  })

  //const bucket = storage.bucket(process.env.GCS_BUCKET_NAME)
  const bucket = storage.bucket("friday-storage")
  const filePath = path.join("default", req.query.name).replace(/\\/g, "/")
  const [url] = await bucket.file(filePath).getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + 15 * 60 * 1000 // 15 minutes
  })

  return res.respond({
    url: url
  })
}

const getWorkspaceOverview = async (req, res) => {
  const from = req.query.from
  const to = req.query.to

  const filter = {
    created_at: {
      $gte: from,
      $lte: to
    }
  }

  const listWorkspace = await workspaceMongoModel.find(filter)
  const result = {
    all_member: 0,
    private: 0,
    public: 0
  }

  forEach(listWorkspace, (item) => {
    if (item.type === "private") {
      result["private"] += 1
    } else if (item.type === "public") {
      result["public"] += 1
    }

    if (item.all_member === true) {
      result["all_member"] += 1
    }
  })

  return res.respond(result)
}

const getListWorkspaceSeparateType = async (req, res) => {
  const page = 1
  const limitManage = 4
  const limitJoin = 6
  const userId = isEmpty(req.query.user_id) ? req.__user : req.query.user_id
  const text = req.query.text === undefined ? "" : req.query.text

  try {
    let condition = {}
    if (text.trim().length > 0) {
      condition = {
        name: { $regex: ".*" + text + ".*", $options: "i" }
      }
    }

    const workspaceManage = await workspaceMongoModel
      .find({ administrators: parseInt(userId), ...condition })
      .sort({
        _id: "desc"
      })

    const workspaceJoin = await workspaceMongoModel
      .find({
        "members.id_user": parseInt(userId),
        ...condition
      })
      .sort({
        _id: "desc"
      })

    const dataWorkspaceManage = await _handleWorkspaceData(
      workspaceManage.slice(0, limitManage)
    )
    const dataWorkspaceJoin = await _handleWorkspaceData(
      workspaceJoin.slice(0, limitJoin),
      userId
    )

    return res.respond({
      data_manage: dataWorkspaceManage,
      data_join: dataWorkspaceJoin
    })
  } catch (err) {
    return res.fail(err.message)
  }
}

const _handleWorkspaceData = async (listWorkspace, userId = 0) => {
  const promises = []
  listWorkspace.map((item) => {
    promises.push(
      new Promise(async (resolve, reject) => {
        let limitMember = isArray(item.members) ? item.members : []
        let currentMember = {}
        limitMember = limitMember
          .map((itemLimit) => {
            if (isObject(itemLimit)) {
              currentMember =
                parseInt(itemLimit?.id_user) === userId ? itemLimit : {}

              return itemLimit?.id_user
            }

            return itemLimit
          })
          .filter((itemFilter) => {
            return itemFilter !== undefined
          })

        const listMember = await getUsers(limitMember)
        const totalMember = listMember.length

        if (limitMember.length > 3) {
          limitMember = limitMember.slice(0, 3)
        }

        try {
          const listMember = await getUsers(limitMember)
          const dataMember = listMember.map((itemMember) => {
            return {
              id: itemMember.id,
              username: itemMember.username,
              avatar: itemMember.avatar,
              full_name: itemMember.full_name,
              email: itemMember.email
            }
          })
          resolve({
            id: item._id,
            name: item.name,
            type: item.type,
            cover_image: item.cover_image,
            member_number: isArray(item.members) ? item.members.length : 0,
            members: dataMember,
            current_member_join: currentMember,
            total_member: totalMember
          })
        } catch (err) {
          resolve({
            id: item._id,
            name: item.name,
            type: item.type,
            cover_image: item.cover_image,
            member_number: isArray(item.members) ? item.members.length : 0,
            members: [],
            current_member_join: {},
            total_member: totalMember
          })
        }
      })
    )
  })

  const data = []
  await Promise.allSettled(promises).then((res) => {
    forEach(res, (item) => {
      if (item.status === "fulfilled") {
        data.push(item.value)
      }
    })
  })

  return data
}

const saveAvatar = async (req, res) => {
  const image = req.body.avatar
  const imageFile = {}
  imageFile.content = image
  imageFile.name = req.body._id + "_avatar.png"
  const pathUpload = "modules/workspace/" + req.body._id
  const upp = await _uploadServices(pathUpload, [imageFile], true)

  try {
    const update = await workspaceMongoModel.findOneAndUpdate(
      { _id: req.body._id },
      { $set: { avatar: upp.uploadSuccess[0]?.path } }
    )
    return res.respond(update)
  } catch (err) {
    return res.fail(err.message)
  }
}

const deleteWorkspace = async (req, res) => {
  try {
    const update = await workspaceMongoModel.deleteOne({
      _id: req.body._id
    })
    return res.respond(update)
  } catch (err) {
    return res.fail(err.message)
  }
}

const createGroupChat = async (req, res) => {
  const workspaceId = req.params.id
  const workspaceName = req.body.workspace_name

  try {
    const groupChatId = await handleAddNewGroupToFireStore(
      req.__user.toString(),
      workspaceName,
      [],
      true
    )

    await workspaceMongoModel.updateOne(
      {
        _id: workspaceId
      },
      {
        group_chat_id: groupChatId
      }
    )

    return res.respond(groupChatId)
  } catch (err) {
    return res.fail(err.message)
  }
}

const updateWorkspaceMemberAndChatGroup = async (req, res) => {
  const workspaceIdAdd = isEmpty(req.body.workspace_add)
    ? null
    : req.body.workspace_add
  const workspaceIdRemove = isEmpty(req.body.workspace_remove)
    ? null
    : req.body.workspace_remove

  const memberId = req.body.employee_id
  const commonChatGroup = req.body.common_chat_group
  const isRemoveCommonChatGroup = req.body.is_remove_common_chat_group
  try {
    if (workspaceIdAdd !== null) {
      const workspace = await workspaceMongoModel.findById(workspaceIdAdd)
      const pushData = {
        id_user: memberId,
        joined_at: moment().toISOString()
      }
      const members =
        workspace?.members === undefined
          ? [pushData]
          : [...workspace.members, pushData]

      await workspaceMongoModel.updateOne(
        {
          _id: workspaceIdAdd
        },
        { ...workspace._doc, members: members }
      )
      await handleAddMemberToFireStoreGroup(
        req.__user,
        workspace.group_chat_id,
        [memberId],
        false
      )
    }

    if (workspaceIdRemove !== null) {
      const workspace = await workspaceMongoModel.findById(workspaceIdRemove)
      const dataUpdateWorkspace = _handleRemoveMember(workspace, {
        member_id: memberId
      })

      await workspaceMongoModel.updateOne(
        {
          _id: workspaceIdRemove
        },
        { ...dataUpdateWorkspace }
      )

      await handleRemoveMemberFromFireStoreGroup(
        req.__user,
        workspace.group_chat_id,
        [memberId],
        false
      )
    }

    if (commonChatGroup !== null) {
      if (isRemoveCommonChatGroup) {
        await handleRemoveMemberFromFireStoreGroup(
          req.__user,
          commonChatGroup,
          [memberId],
          false
        )
      } else {
        await handleAddMemberToFireStoreGroup(
          req.__user,
          commonChatGroup,
          [memberId],
          false
        )
      }
    }

    return res.respond({
      success: true
    })
  } catch (err) {
    return res.respond({
      success: false,
      err: err
    })
  }
}
const createGroupChatCompany = async (req, res) => {
  const groupChatName = req.body?.name
  const admin = req.body?.owner ? [req.body?.owner.toString()] : []
  const arrMember = await getUserActivated()
  const member = arrMember.map((item) => item.id)
  const groupChatId = await handleAddNewGroupToFireStore(
    req.__user.toString(),
    groupChatName,
    member,
    true,
    admin
  )

  return res.respond({ groupChatId: groupChatId })
}

const removeGroupChatId = async (req, res) => {
  const groupChatId = req.body?.group_chat_id

  try {
    await workspaceMongoModel.updateMany(
      { group_chat_id: groupChatId },
      { group_chat_id: "" }
    )

    return res.respond({
      success: true
    })
  } catch (err) {
    return res.respond({
      success: false,
      err: err
    })
  }
}

export {
  getWorkspace,
  getWorkspaceOverview,
  _saveWorkspace,
  saveWorkspace,
  getUserWorkspaceIds,
  getListWorkspace,
  saveCoverImage,
  updateWorkspace,
  sortGroupRule,
  loadDataMember,
  loadDataMedia,
  getPostWorkspace,
  approvePost,
  loadFeed,
  addMemberByDepartment,
  loadPinned,
  loadGCSObjectLink,
  removeCoverImage,
  getListWorkspaceSeparateType,
  saveAvatar,
  deleteWorkspace,
  createGroupChat,
  updateWorkspaceMemberAndChatGroup,
  createGroupChatCompany,
  removeGroupChatId
}
