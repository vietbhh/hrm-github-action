import workspaceMongoModel from "../models/workspace.mongo.js"
import feedMongoModel from "../../feed/models/feed.mongo.js"
import { isEmpty, forEach, map } from "lodash-es"
import path, { dirname } from "path"
import { _uploadServices } from "#app/services/upload.js"
import fs from "fs"
import { getUsers, usersModel } from "#app/models/users.mysql.js"
import { Op } from "sequelize"
import { handleDataBeforeReturn } from "#app/utility/common.js"
import { Storage } from "@google-cloud/storage"
import moment from "moment/moment.js"
import { sendNotification } from "#app/libraries/notifications/Notifications.js"
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

const saveCoverImage = async (req, res) => {
  const image = req.body.image
  const imageFile = {}
  imageFile.content = image
  imageFile.name = req.body._id + "_cover.png"
  const pathUpload = "modules/workspace/" + req.body._id
  const upp = await _uploadServices(pathUpload, [imageFile], true)

  try {
    const update = await workspaceMongoModel.findOneAndUpdate(
      { _id: req.body._id },
      { $set: { cover_image: upp.uploadSuccess[0]?.path } }
    )
    return res.respond(update)
  } catch (err) {
    return res.fail(err.message)
  }
}

const removeCoverImage = async (req, res) => {
  const id = req.body._id
}

const addMemberByDepartment = async (req, res) => {
  const dataSave = { ...req.body }
  // const infoWS = await workspaceMongoModel.findById(dataSave._id)
  if (dataSave.departments) {
    console.log("data", JSON.parse(dataSave.departments))
  }

  return 1
}

const getPostWorkspace = async (req, res) => {
  try {
    const filter = {
      permission_ids: req.query.id,
      permission: "workspace",
      approve_status: "pending"
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

const getListWorkspace = async (req, res, next) => {
  const page = req.query.page === 1 ? 0 : req.query.page - 1
  const limit = req.query.limit
  const workspaceType = req.query.workspace_type
  const userId = isEmpty(req.query.user_id) ? req.__user : req.query.user_id
  try {
    let filter = {}
    if (workspaceType === "joined") {
      filter = { members: parseInt(userId) }
    } else if (workspaceType === "managed") {
      filter = { administrators: parseInt(userId) }
    } else if (workspaceType === "both") {
      filter = {
        $or: [
          { members: parseInt(userId) },
          { administrators: parseInt(userId) }
        ]
      }
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
      if (requestData?.members) {
        updateData.members = JSON.parse(requestData.members)
        if (updateData?.membership_approval === "approver") {
          const body =
            "<strong> member" +
            "</strong> {{modules.network.notification.request_workspace}}"
          const link = "workspace/" + workspaceId + "/pending-posts"
          await sendNotification(
            1,
            updateData?.administrators,
            {
              title: "",
              body: body,
              link: link
            },
            {
              skipUrls: ""
            }
          )
        }
      }
      if (requestData?.administrators) {
        updateData.administrators = JSON.parse(requestData.administrators)
      }
      if (requestData?.pinPosts) {
        updateData.pinPosts = JSON.parse(requestData.pinPosts)
      }
      if (requestData?.request_joins) {
        updateData.request_joins = JSON.parse(requestData.request_joins)
        // sent a request to join the workspace
        if (updateData?.membership_approval === "approver") {
          const body =
            "<strong> NVT" +
            "</strong> {{modules.network.notification.request_workspace}}"
          const link = "workspace/" + workspaceId + "/pending-posts"
          await sendNotification(
            1,
            updateData?.administrators,
            {
              title: "",
              body: body,
              link: link
            },
            {
              skipUrls: ""
            }
          )
        }
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

const loadDataMedia = async (req, res, next) => {
  const workspaceId = req.params.id
  const mediaTypeNumber = req.query.media_type
  const page = req.query.page
  const pageLength = req.query.page_length

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
    return "file"
  } else if (mediaTypeNumber === 2) {
    return "image"
  } else if (mediaTypeNumber === 3) {
    return "video"
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
    const feedUpdate = await feedMongoModel.findOneAndUpdate(
      { _id: req.body?.id },
      {
        ...req.body
      },
      { new: true }
    )
    const data = await handleDataBeforeReturn(feedUpdate)
    if (data) {
      const status =
        data?.approve_status === "approved"
          ? "has been approved"
          : "has been rejected"
      const full_name = data?.created_by?.full_name
      const workspaceName = infoWorkSpace?.name
      const body = "Post in <strong>" + workspaceName + "</strong> " + status
      const link =
        data?.approve_status === "approved" ? "workspace/" + idWorkspace : ""
      await sendNotification(
        1,
        [data?.created_by?.id],
        {
          title: "",
          body: body,
          link: link
        },
        {
          skipUrls: ""
        }
      )
    }
    return res.respond(feedUpdate)
  } catch {
    return res.fail(err.message)
  }
}
const loadFeed = async (req, res) => {
  const request = req.query
  const page = request.page
  const pageLength = request.pageLength
  const filter = {
    permission_ids: req.query.workspace,
    permission: "workspace",
    approve_status: "approved",
    ref: null
  }
  const feed = await feedMongoModel
    .find(filter)
    .skip(page * pageLength)
    .limit(pageLength)
    .sort({
      _id: "desc"
    })
  const data = await handleDataBeforeReturn(feed, true)
  const feedCount = await feedMongoModel.find(filter).count()
  const result = {
    dataPost: data,
    totalPost: data.length,
    page: page * 1 + 1,
    hasMore: (page * 1 + 1) * pageLength < feedCount
  }
  return res.respond(result)
}

const loadPinned = async (req, res) => {
  const request = req.query
  const workspaceId = request.id
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

export {
  getWorkspace,
  saveWorkspace,
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
  removeCoverImage
}
