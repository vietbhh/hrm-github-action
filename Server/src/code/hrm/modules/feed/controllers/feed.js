import { sendNotification } from "#app/libraries/notifications/Notifications.js"
import calendarMongoModel from "#code/hrm/modules/calendar/models/calendar.mongo.js"
import {
  getUser,
  getUserActivated,
  getUserbyDepartment
} from "#app/models/users.mysql.js"
import { getSetting } from "#app/services/settings.js"
import {
  _uploadServices,
  copyFilesServices,
  localSavePath,
  moveFileFromServerToGCS
} from "#app/services/upload.js"
import { handleDataBeforeReturn } from "#app/utility/common.js"
import ffmpegPath from "@ffmpeg-installer/ffmpeg"
import ffprobePath from "@ffprobe-installer/ffprobe"
import FfmpegCommand from "fluent-ffmpeg"
import fs from "fs"
import {
  cloneDeep,
  forEach,
  isArray,
  isEmpty,
  isObject,
  reverse,
  union
} from "lodash-es"
import path from "path"
import sharp from "sharp"
import workspaceMongoModel from "../../workspace/models/workspace.mongo.js"
import commentMongoModel from "../models/comment.mongo.js"
import endorsementMongoModel from "../models/endorsement.mongo.js"
import feedMongoModel from "../models/feed.mongo.js"
import { newsModel } from "../models/news.mysql.js"
import { handleDataComment } from "./comment.js"
import { handleGetAnnouncementById } from "./announcement.js"
import { handleGetEventById } from "./event.js"
import { handleGetEndorsementById } from "./endorsement.js"
import hashtagMongoModel from "../models/hashtag.mongo.js"
import {
  deleteNotification,
  sendNotificationCommentImagePost,
  sendNotificationPostPending,
  sendNotificationPostPendingFeed,
  sendNotificationReactionImagePost,
  sendNotificationReactionPost,
  sendNotificationReactionPostTag,
  sendNotificationTagInPost,
  sendNotificationUnseenPost
} from "../../workspace/controllers/notification.js"
import { getUserWorkspaceIds } from "../../workspace/controllers/workspace.js"
import { getOptionValue } from "#app/helpers/appOptionsHelper.js"
import moment from "moment"

FfmpegCommand.setFfmpegPath(ffmpegPath.path)
FfmpegCommand.setFfprobePath(ffprobePath.path)

// ** create Post
const uploadTempAttachmentController = async (req, res, next) => {
  const storePath = path.join("modules", "feed_temp")
  if (!fs.existsSync(path.join(localSavePath, storePath))) {
    fs.mkdirSync(path.join(localSavePath, storePath), { recursive: true })
  }
  const body = req.body
  const file = req.files
  const promises = []
  forEach(file, (value, index) => {
    const type = body[index.replace("file", "type")]
    const promise = new Promise(async (resolve, reject) => {
      const result = await handleUpFileTemp(value, type, storePath)
      resolve(result)
    })
    promises.push(promise)
  })
  return Promise.all(promises).then((res_promise) => {
    return res.respond(res_promise)
  })
}

const submitPostController = async (req, res, next) => {
  const storePathTemp = path.join("modules", "feed_temp")
  const dateToDay = handleCurrentYMD()
  const storePath = path.join("modules", "feed", dateToDay)
  if (!fs.existsSync(path.join(localSavePath, storePath))) {
    fs.mkdirSync(path.join(localSavePath, storePath), { recursive: true })
  }
  const body = req.body

  // check add or edit
  const _id_post_edit = body._id_post_edit
  let is_edit = false
  if (_id_post_edit) {
    is_edit = true
  }

  const workspace_type =
    body.workspace.length === 0 && body.privacy_type === "workspace"
      ? "default"
      : body.privacy_type
  const link = body.arrLink

  // ** check type feed parent
  let type_feed_parent = "post"
  if (link.length > 0) {
    type_feed_parent = "link"
  }
  if (body.file.length === 1) {
    type_feed_parent = "image"
    if (body.file[0].type.includes("video/")) {
      type_feed_parent = "video"
    }
  }
  if (body.backgroundImage !== null && body.backgroundImage !== undefined) {
    type_feed_parent = "background_image"
  }

  // check has_poll_vote
  let has_poll_vote = false
  const save_poll_vote_detail = {}
  if (body.poll_vote === true) {
    has_poll_vote = true

    const req_poll_vote_detail = body.poll_vote_detail
    save_poll_vote_detail["question"] = req_poll_vote_detail.question
    save_poll_vote_detail["setting"] = req_poll_vote_detail.setting
    save_poll_vote_detail["time_end"] = req_poll_vote_detail.time_end
    const options = []
    forEach(req_poll_vote_detail.options, (item) => {
      options.push({ option_name: item, user_vote: [] })
    })
    save_poll_vote_detail["options"] = options
  }

  const mention = body.mention
  const tag = body.tag_your_colleagues
  const tag_user = { mention: mention, tag: tag }

  try {
    let out = {}
    let _id_parent = ""
    let data_feed_old = {}
    const dataInsert = {
      __user: req.__user,
      permission_ids: body.workspace,
      permission: workspace_type,
      content: body.content,
      type: type_feed_parent,
      medias: [],
      source: null,
      source_attribute: {},
      thumb: null,
      thumb_attribute: {},
      ref: null,
      approve_status: body.approveStatus,
      link: link,
      tag_user: tag_user,
      background_image: body.backgroundImage,
      has_poll_vote: has_poll_vote,
      poll_vote_detail: save_poll_vote_detail,
      hashtag: body.arrHashtag
    }

    if (!is_edit) {
      const feedModelParent = new feedMongoModel({
        ...dataInsert,
        seen: [req.__user]
      })
      const saveFeedParent = await feedModelParent.save()
      _id_parent = saveFeedParent._id
      out = saveFeedParent
      if (workspace_type === "workspace" && body.approveStatus === "pending") {
        sendNotificationPostPending(dataInsert, body.data_user)
      }
      if (workspace_type === "default" && body.approveStatus === "pending") {
        const userApprove = await getSetting(
          "feed_approval_post_notification_user"
        )
        sendNotificationPostPendingFeed(dataInsert, body.data_user, userApprove)
      }
    } else {
      _id_parent = _id_post_edit
      data_feed_old = await feedMongoModel.findById(_id_parent)
      await feedMongoModel.updateOne(
        { _id: _id_post_edit },
        {
          ...dataInsert,
          edited: true
        }
      )

      // pull hashtag
      await handlePullHashtag(data_feed_old)
    }

    // insert hashtag
    await handleInsertHashTag(body.arrHashtag, req.__user, _id_parent)

    // send notification tag
    if (!is_edit && body.approveStatus === "approved") {
      const receivers = union(mention, tag)
      if (receivers) {
        sendNotificationTagInPost(
          { _id: _id_parent },
          body.data_user,
          body.content,
          receivers
        )
      }
    }

    if (body.file.length === 0) {
      if (is_edit && !isEmpty(data_feed_old.medias)) {
        const id_medias_delete = []
        forEach(data_feed_old.medias, (value) => {
          id_medias_delete.push(value._id)
        })
        await feedMongoModel.deleteMany({ _id: { $in: id_medias_delete } })
        // xoa file
      }
    } else {
      // ** check file image/video
      if (body.file.length === 1) {
        if (!is_edit || (is_edit && !body.file[0]._id)) {
          const result = await handleMoveFileTempToMain(
            body.file[0],
            storePathTemp,
            storePath
          )
          await feedMongoModel.updateOne(
            { _id: _id_parent },
            {
              source: result.source,
              source_attribute: result.source_attribute,
              thumb: result.thumb,
              thumb_attribute: result.thumb_attribute
            }
          )
        }

        if (is_edit && body.file[0]._id) {
          await feedMongoModel.updateOne(
            { _id: _id_parent },
            {
              source: body.file[0].source,
              source_attribute: body.file[0].source_attribute,
              thumb: body.file[0].thumb,
              thumb_attribute: body.file[0].thumb_attribute
            }
          )
        }

        if (is_edit && !isEmpty(data_feed_old.medias)) {
          const id_medias_delete = []
          forEach(data_feed_old.medias, (value) => {
            id_medias_delete.push(value._id)
          })
          await feedMongoModel.deleteMany({
            _id: { $in: id_medias_delete }
          })
          // xoa file
        }
      } else {
        const promises = []
        forEach(body.file, (value, key) => {
          const promise = new Promise(async (resolve, reject) => {
            let _resolve = {}
            let type_feed = "image"
            if (value.type.includes("video/")) {
              type_feed = "video"
            }
            if (!value._id) {
              const result = await handleMoveFileTempToMain(
                value,
                storePathTemp,
                storePath
              )
              const feedModelChild = new feedMongoModel({
                __user: req.__user,
                permission_ids: body.workspace,
                permission: workspace_type,
                content: value.description,
                type: type_feed,
                source: result.source,
                source_attribute: result.source_attribute,
                thumb: result.thumb,
                thumb_attribute: result.thumb_attribute,
                ref: _id_parent,
                sort_number: key,
                approve_status: body.approveStatus
              })
              const saveFeedChild = await feedModelChild.save()
              _resolve = {
                _id: saveFeedChild._id,
                type: type_feed,
                source: saveFeedChild.source,
                source_attribute: saveFeedChild.source_attribute,
                thumb: saveFeedChild.thumb,
                thumb_attribute: saveFeedChild.thumb_attribute,
                description: saveFeedChild.content
              }
            } else {
              await feedMongoModel.updateOne(
                { _id: value._id },
                { content: value.description, sort_number: key }
              )
              _resolve = {
                _id: value._id,
                type: type_feed,
                source: value.source,
                source_attribute: value.source_attribute,
                thumb: value.thumb,
                thumb_attribute: value.thumb_attribute,
                description: value.description
              }
            }

            resolve(_resolve)
          })
          promises.push(promise)
        })

        await Promise.all(promises).then(async (arr_id_child) => {
          await feedMongoModel.updateOne(
            { _id: _id_parent },
            { medias: arr_id_child }
          )

          if (is_edit && !isEmpty(data_feed_old.medias)) {
            const id_medias_delete = []
            forEach(data_feed_old.medias, (value) => {
              const index_medias = arr_id_child.findIndex((item) => {
                return item._id === value._id.toString()
              })
              if (index_medias === -1) {
                id_medias_delete.push(value._id)
              }
            })
            if (!isEmpty(id_medias_delete)) {
              await feedMongoModel.deleteMany({
                _id: { $in: id_medias_delete }
              })
              // xoa file
            }
          }
        })
      }
    }

    if (!is_edit) {
      out = await feedMongoModel.findById(_id_parent)
      const _out = await handleDataBeforeReturn(out)
      _out["dataLink"] = {}
      return res.respond(_out)
    } else {
      // update history
      const field_compare = [
        "content",
        "medias",
        "source",
        "thumb",
        "tag_user",
        "background_image",
        "poll_vote_detail"
      ]
      const data_new = await feedMongoModel.findById(_id_parent)
      const data_edit_history = handleDataHistory(
        req.__user,
        data_new,
        data_feed_old,
        field_compare,
        { type: data_feed_old.type }
      )
      if (!isEmpty(data_edit_history)) {
        await feedMongoModel.updateOne(
          { _id: _id_parent },
          {
            $push: { edit_history: data_edit_history }
          }
        )
      }

      const _out = await handleDataFeedById(_id_parent)
      _out["dataLink"] = {}
      return res.respond(_out)
    }
  } catch (err) {
    return res.fail(err.message)
  }
}
// **

// ** Load feed
const loadFeedController = async (req, res, next) => {
  const request = req.query
  const page = request.page
  const pageLength = request.pageLength
  const filter = { ref: null, approve_status: "approved" }
  const from = request.from
  const to = request.to
  const isFeaturedPost = request.is_featured_post
  const type = request.type

  const userWorkspaceIds = await getUserWorkspaceIds(req.__user)

  if (request.idPostCreateNew !== "" && request.idPostCreateNew !== undefined) {
    filter["_id"] = { $lt: request.idPostCreateNew }
  }

  if (!isEmpty(from) && !isEmpty(to)) {
    filter["created_at"] = {
      $gte: from + " 00:00:00",
      $lte: to + " 23:59:59"
    }
  }

  if (!isEmpty(type)) {
    if (type === "personal") {
      filter["$or"] = [
        {
          permission: "default"
        },
        {
          $and: [
            {
              permission: "only_me"
            },
            {
              owner: req.__user
            }
          ]
        }
      ]
    } else if (type === "workspace") {
      filter["permission"] = "workspace"
    }
  } else {
    filter["$or"] = [
      {
        $and: [
          { permission: "workspace" },
          {
            permission_ids: {
              $in: userWorkspaceIds
            }
          }
        ]
      },
      {
        $or: [
          {
            permission: "default"
          },
          {
            $and: [
              {
                permission: "only_me"
              },
              {
                owner: req.__user
              }
            ]
          }
        ]
      }
    ]
  }

  try {
    const feed = await feedMongoModel
      .find(filter)
      .skip(page * pageLength)
      .limit(pageLength)
      .sort({
        _id: "desc"
      })
    const feedCount = await feedMongoModel.find(filter).count()

    if (isFeaturedPost === "true") {
      const data = await handleDataBeforeReturn(feed, true)

      const workspaceId = []

      data.map((item, index) => {
        data[index]["seen_count"] = item.seen === null ? 0 : item.seen.length
        data[index]["reaction_number"] =
          item.reaction === null ? 0 : item.reaction.length
        data[index]["comment_number"] =
          item.comment_ids === null ? 0 : item.comment_ids.length
        data[index]["created_at"] = item.created_at

        if (item.permission === "workspace") {
          item.permission_ids.map((workspaceIdItem) => {
            if (workspaceIdItem.match(/^[0-9a-fA-F]{24}$/)) {
              workspaceId.push(workspaceIdItem)
            }
          })
        }
      })

      const workspaceData = await workspaceMongoModel.find({
        _id: { $in: workspaceId }
      })

      return res.respond({
        data: data,
        workspace_data: workspaceData,
        total_data: feedCount
      })
    }

    const result = await handleDataLoadFeed(page, pageLength, feed, feedCount)
    return res.respond(result)
  } catch (err) {
    return res.fail(err.message)
  }
}

// load feed profile
const loadFeedProfile = async (req, res, next) => {
  const request = req.query
  const page = request.page
  const pageLength = request.pageLength
  const id_profile =
    request.id_profile === "undefined" || request.id_profile === undefined
      ? 0
      : request.id_profile
  const filter = {
    $and: [
      { ref: null },
      {
        $or: [{ permission: "default" }, { permission: "only_me" }]
      },
      {
        $or: [
          { created_by: id_profile },
          { "tag_user.mention": id_profile },
          { "tag_user.tag": id_profile }
        ]
      }
    ]
  }
  if (request.idPostCreateNew !== "") {
    filter["$and"].push({ _id: { $lt: request.idPostCreateNew } })
  }
  try {
    const feed = await feedMongoModel
      .find(filter)
      .skip(page * pageLength)
      .limit(pageLength)
      .sort({
        _id: "desc"
      })
    const feedCount = await feedMongoModel.find(filter).count()
    const result = await handleDataLoadFeed(page, pageLength, feed, feedCount)
    return res.respond(result)
  } catch (err) {
    return res.fail(err.message)
  }
}

// get feed by id
const getFeedById = async (req, res, next) => {
  const id = req.params.id
  const userWorkspaceIds = await getUserWorkspaceIds(req.__user)
  try {
    const data = await handleDataFeedById(id)
    if (data.permission === "workspace") {
      if (!isEmpty(data.permission_ids)) {
        const group = data.permission_ids[0]

        if (
          group.type === "public" ||
          userWorkspaceIds.some((userWorkspaceIds) =>
            userWorkspaceIds.equals(group._id)
          )
        )
          return res.respond(data)
      }
    } else {
      return res.respond(data)
    }
    return res.fail("post_not_found")
  } catch (err) {
    return res.fail(err.message)
  }
}

// get feed by id and view all comment
const getFeedByIdAndViewAllComment = async (req, res, next) => {
  const id = req.params.id
  try {
    const data = await handleDataFeedById(id, 0)
    return res.respond(data)
  } catch (err) {
    return res.fail(err.message)
  }
}

// get feed child
const getFeedChild = async (req, res, next) => {
  const id = req.params.id
  try {
    const feed = await feedMongoModel.find({ ref: id }).sort({
      sort_number: "asc"
    })
    return res.respond(feed)
  } catch (err) {
    return res.fail(err.message)
  }
}

// update reaction
const updatePostReaction = async (req, res, next) => {
  const body = req.body
  const id = body._id
  const comment_more_count_original = body.comment_more_count_original
  const react_type = body.react_type
  const react_action = body.react_action
  const full_name = body.full_name
  const created_by = body.created_by
  let infoPost = await feedMongoModel.findById(id)
  const turn_off_notification = infoPost.turn_off_notification
  turn_off_notification.push(req.__user)
  const arrTag = infoPost.tag_user.tag
  const arrMention = infoPost.tag_user.mention
  const allTag = arrTag.concat(arrMention)
  const allTagCheckExist = [...new Set(allTag)]
  const allTagSend = allTagCheckExist.filter(
    (i) => !turn_off_notification.includes(i)
  )

  try {
    await feedMongoModel.updateMany(
      { _id: id, "reaction.react_user": req.__user },
      { $pull: { "reaction.$.react_user": req.__user } }
    )
    if (react_action === "remove") {
      const postUpdate = await feedMongoModel.findById(id)
      let reactionOld = ""
      let idUser = 0
      postUpdate.reaction.map((reaction) => {
        if (reaction.react_user.length > 0) {
          idUser = reaction.react_user[reaction.react_user.length - 1] * 1
          reactionOld = reaction.react_type
        }
      })
      if (idUser) {
        const infoUserOld = await getUser(idUser)
        const receivers = [created_by]
        sendNotificationReactionPost(
          postUpdate,
          infoUserOld,
          reactionOld,
          receivers,
          true
        )
      } else {
        deleteNotification(id, "reaction_post")
      }
    }
    if (react_action === "add") {
      const update = await feedMongoModel.updateOne(
        { _id: id, "reaction.react_type": react_type },
        { $push: { "reaction.$.react_user": req.__user } }
      )
      if (update.matchedCount === 0) {
        await feedMongoModel.updateOne(
          { _id: id },
          {
            $push: {
              reaction: { react_type: react_type, react_user: req.__user }
            }
          }
        )
      }
      infoPost = await feedMongoModel.findById(id)
      if (allTagSend.length > 0) {
        sendNotificationReactionPostTag(
          infoPost,
          { id: req.__user, full_name: full_name },
          react_type,
          allTagSend
        )
      }
      // ** send notification
      const arrUserNotReceivedNotification = isEmpty(
        infoPost.turn_off_notification
      )
        ? []
        : infoPost.turn_off_notification
      if (
        req.__user.toString() !== created_by.toString() &&
        !arrUserNotReceivedNotification.includes(created_by)
      ) {
        const receivers = [created_by]
        if (infoPost.ref && (infoPost.type === "image" || "video")) {
          sendNotificationReactionImagePost(
            infoPost,
            { id: req.__user, full_name: full_name },
            react_type,
            receivers
          )
        } else {
          sendNotificationReactionPost(
            infoPost,
            { id: req.__user, full_name: full_name },
            react_type,
            receivers
          )
        }
      }
    }

    const data = await handleDataFeedById(id, comment_more_count_original)
    return res.respond(data)
  } catch (err) {
    return res.fail(err.message)
  }
}

// delete post
const deletePost = async (req, res, next) => {
  const body = req.body
  const ref = body.ref
  const _id = body._id
  const type = body.type
  const link_id = body.link_id

  if (_id) {
    // delete feed
    if (ref === null) {
      const arr_id_delete = [_id]
      const feed = await feedMongoModel.findById(_id)
      const medias = feed.medias
      if (!isEmpty(medias)) {
        forEach(medias, (value) => {
          arr_id_delete.push(value._id)
        })
      }
      try {
        await feedMongoModel.deleteMany({
          _id: { $in: arr_id_delete }
        })
        await commentMongoModel.deleteMany({
          post_id: { $in: arr_id_delete }
        })

        if (link_id) {
          if (type === "event") {
            await calendarMongoModel.deleteOne({ _id: link_id })
          }

          if (type === "announcement") {
            await newsModel.destroy({ where: { id: link_id } })
          }

          if (type === "endorsement") {
            await endorsementMongoModel.deleteOne({ _id: link_id })
          }
        }

        const out = { status: "empty" }
        return res.respond(out)
      } catch (err) {
        return res.fail(err.message)
      }
    }

    // delete post media
    if (ref !== null) {
      try {
        const out = { status: "medias" }
        await feedMongoModel.deleteOne({ _id: _id })
        await commentMongoModel.deleteMany({ post_id: _id })
        await feedMongoModel.updateOne(
          { _id: ref },
          { $pull: { medias: { _id: _id } } }
        )
        const feed = await feedMongoModel.findById(ref)
        if (feed.medias.length === 1) {
          const data_update_parent = {
            ref: null,
            medias: [],
            type: feed.medias[0].type,
            source: feed.medias[0].source,
            source_attribute: feed.medias[0].source_attribute,
            thumb: feed.medias[0].thumb,
            thumb_attribute: feed.medias[0].thumb_attribute
          }
          await feedMongoModel.updateOne({ _id: ref }, data_update_parent)
          await feedMongoModel.deleteOne({ _id: feed.medias[0]._id })
          await commentMongoModel.deleteMany({ post_id: feed.medias[0]._id })
          out["status"] = "medias-1"
          out["data"] = data_update_parent
          return res.respond(out)
        }
        if (isEmpty(feed.medias)) {
          await feedMongoModel.deleteOne({ _id: ref })
          await commentMongoModel.deleteMany({ post_id: ref })
          out["status"] = "empty"
          return res.respond(out)
        }
        return res.respond(out)
      } catch (err) {
        return res.fail(err.message)
      }
    }
  }

  return res.fail("not-found")
}

// update content media
const updateContentMedia = async (req, res, next) => {
  const body = req.body
  const content = body.content
  const data = body.data
  if (!isEmpty(data) && data._id) {
    try {
      await feedMongoModel.updateOne(
        { _id: data._id },
        { content: content, edited: true }
      )
      if (data.ref) {
        const feed_parent = await feedMongoModel.findById(data.ref)
        if (!isEmpty(feed_parent.medias)) {
          const medias = [...feed_parent.medias]
          const index_medias = medias.findIndex(
            (item) => item._id.toString() === data._id.toString()
          )
          if (index_medias > -1) {
            medias[index_medias]["description"] = content
            await feedMongoModel.updateOne(
              { _id: data.ref },
              { medias: medias }
            )
          }
        }
      }

      return res.respond("success")
    } catch (err) {
      return res.fail(err.message)
    }
  }

  return res.fail("not-found")
}

// update seen post
const updateSeenPost = async (req, res, next) => {
  try {
    const post_id = req.params.post_id
    await feedMongoModel.updateOne(
      { _id: post_id },
      { $addToSet: { seen: req.__user } }
    )

    return res.respond("success")
  } catch (err) {
    return res.fail(err.message)
  }
}

// send notification unseen
const sendNotificationUnseen = async (req, res, next) => {
  try {
    const post_id = req.params.post_id
    const feed = await feedMongoModel.findById(post_id)
    const seen = feed.seen
    const permission = feed.permission
    const permission_ids = feed.permission_ids
    const type = feed.type
    const link_permiss = feed.link_permission
    const link_permiss_employee = link_permiss?.employee
    const link_permiss_department = link_permiss?.department

    const dataUser = await getUserActivated()
    const arrUserActive = []
    forEach(dataUser, (item) => {
      arrUserActive.push(item.id.toString())
    })

    let receivers = []
    if (permission === "default" && type === "event") {
      if (link_permiss.is_all) {
        receivers = arrUserActive.filter((x) => !seen.includes(x))
      } else {
        const listUserbyDepartment = await getUserbyDepartment(
          link_permiss_department
        )
        const result = listUserbyDepartment.map((x) => x["id"].toString())
        const employeeConcat = link_permiss_employee.concat(result)
        const checkExist = [...new Set(employeeConcat)]
        receivers = checkExist.filter((x) => !seen.includes(x))
      }
    } else if (permission === "default") {
      //  announcement \ endorsement
      receivers = arrUserActive.filter((x) => !seen.includes(x))
    } else if (permission === "workspace") {
      if (!isEmpty(permission_ids)) {
        const dataWorkspace = await workspaceMongoModel.findById(
          permission_ids[0]
        )
        const members = []
        forEach(dataWorkspace.members, (item) => {
          members.push(item.id_user)
        })
        receivers = members.filter((x) => !seen.includes(x))
      }
    } else if (permission === "employee") {
      receivers = permission_ids.filter((x) => !seen.includes(x))
    }
    if (!isEmpty(receivers)) {
      const dataSender = await getUser(req.__user)
      sendNotificationUnseenPost(feed, dataSender, receivers)
    }

    return res.respond("success")
  } catch (err) {
    return res.fail(err.message)
  }
}

// turn off notification
const turnOffNotification = async (req, res, next) => {
  try {
    const body = req.body
    const action = body.action
    const post_id = body.post_id

    if (action !== "add" && action !== "remove") {
      return res.fail("err action")
    }

    if (action === "add") {
      await feedMongoModel.updateOne(
        { _id: post_id },
        { $push: { turn_off_notification: req.__user } }
      )
    }

    if (action === "remove") {
      await feedMongoModel.updateOne(
        { _id: post_id },
        { $pull: { turn_off_notification: req.__user } }
      )
    }

    return res.respond("success")
  } catch (err) {
    return res.fail(err.message)
  }
}

// turn off commenting
const turnOffCommenting = async (req, res, next) => {
  try {
    const body = req.body
    const action = body.action
    const post_id = body.post_id

    if (action !== "on" && action !== "off") {
      return res.fail("err action")
    }

    if (action === "on") {
      await feedMongoModel.updateOne(
        { _id: post_id },
        { turn_off_commenting: false }
      )
    }

    if (action === "off") {
      await feedMongoModel.updateOne(
        { _id: post_id },
        { turn_off_commenting: true }
      )
    }

    return res.respond("success")
  } catch (err) {
    return res.fail(err.message)
  }
}

// get data history
const getDataEditHistory = async (req, res, next) => {
  try {
    const post_id = req.params.post_id
    const data_feed = await feedMongoModel.findById(post_id)
    const dataHistory = data_feed
      ? data_feed.edit_history
        ? data_feed.edit_history
        : []
      : []
    const _dataHistory = await handleDataBeforeReturn(dataHistory, true)

    const out = {
      dataFeed: await handleDataBeforeReturn(data_feed),
      dataHistory: reverse(_dataHistory)
    }
    return res.respond(out)
  } catch (err) {
    return res.fail(err.message)
  }
}
// **

// ** support function
const takeOneFrameOfVid = (dir, storePath) => {
  const savePath = path.join(localSavePath, storePath)
  return new Promise((resolve, reject) => {
    FfmpegCommand(dir)
      .takeFrames(1)
      .output(savePath)
      .on("error", function (err, stdout, stderr) {
        reject(new Error("video_processing_failed"))
      })
      .on("end", function () {
        resolve({
          path: storePath
        })
      })
      .run()
  })
}

const handleUpFileTemp = async (file, type, storePath) => {
  const result = {
    type: type,
    description: "",
    thumb: "",
    name_thumb: "",
    source: "",
    name_source: ""
  }

  const resultUpload = await _uploadServices(storePath, [file], false, "direct")
  if (resultUpload.uploadSuccess[0]) {
    result["thumb"] = resultUpload.uploadSuccess[0].path
    result["name_thumb"] = resultUpload.uploadSuccess[0].name
    result["source"] = resultUpload.uploadSuccess[0].path
    result["name_source"] = resultUpload.uploadSuccess[0].name
  }

  if (type.includes("image/")) {
    const name_thumb =
      "thumb_" +
      file.name.split("_")[0] +
      "_" +
      Date.now() +
      "_" +
      Math.random() * 1000001 +
      ".webp"
    const thumb_path = path.join(storePath, name_thumb)
    result["thumb"] = await handleCompressImage(file, thumb_path)
    result["name_thumb"] = name_thumb
  }

  if (type.includes("video/") && resultUpload.uploadSuccess[0]) {
    const name_thumb =
      "thumb_" +
      file.name.split("_")[0] +
      "_" +
      Date.now() +
      "_" +
      Math.random() * 1000001 +
      ".webp"
    await takeOneFrameOfVid(
      path.join(localSavePath, resultUpload.uploadSuccess[0].path),
      path.join(storePath, name_thumb)
    )
      .then((res) => {
        result["thumb"] = res.path
        result["name_thumb"] = name_thumb
      })
      .catch((err) => {})
  }

  return result
}

const handleMoveFileTempToMain = async (
  file_info,
  storePathTemp,
  storePath
) => {
  const upload_type = await getSetting("upload_type")

  const result = {
    source: null,
    source_attribute: {},
    thumb: null,
    thumb_attribute: {}
  }

  if (file_info.db) {
    const arr_path = file_info.source.split("/")
    arr_path.pop()
    storePathTemp = arr_path.join("/")
  }

  // source
  if (file_info.source) {
    if (fs.existsSync(path.join(localSavePath, file_info.source))) {
      if (upload_type === "direct") {
        const resultUpload = await copyFilesServices(
          storePathTemp,
          storePath,
          file_info.name_source
        )
        if (resultUpload.uploadSuccess[0]) {
          result["source"] = resultUpload.uploadSuccess[0].path
          result["source_attribute"] = resultUpload.uploadSuccess[0]
        }
      } else if (upload_type === "cloud_storage") {
        const resultUpload = await moveFileFromServerToGCS(
          storePathTemp,
          storePath,
          file_info.name_source
        )
        if (resultUpload.uploadSuccess[0]) {
          result["source"] = resultUpload.uploadSuccess[0].path
          result["source_attribute"] = resultUpload.uploadSuccess[0]
        }
      }
    }
  }

  // thumb
  if (file_info.thumb) {
    if (fs.existsSync(path.join(localSavePath, file_info.thumb))) {
      if (upload_type === "direct") {
        const resultUpload = await copyFilesServices(
          storePathTemp,
          storePath,
          file_info.name_thumb
        )
        if (resultUpload.uploadSuccess[0]) {
          result["thumb"] = resultUpload.uploadSuccess[0].path
          result["thumb_attribute"] = resultUpload.uploadSuccess[0]
        }
      } else if (upload_type === "cloud_storage") {
        const resultUpload = await moveFileFromServerToGCS(
          storePathTemp,
          storePath,
          file_info.name_thumb
        )
        if (resultUpload.uploadSuccess[0]) {
          result["thumb"] = resultUpload.uploadSuccess[0].path
          result["thumb_attribute"] = resultUpload.uploadSuccess[0]
        }
      }
    }
  }

  return result
}

const handleCompressImage = async (file, savePath) => {
  const image = sharp(file.data)
  /* image.metadata().then((metadata) => {
  }) */
  await image
    .webp({
      quality: 80
    })
    .toFile(path.join(localSavePath, savePath))

  return savePath
}

const handleDataFeedById = async (id, loadComment = -1) => {
  const feed = await feedMongoModel.findById(id)
  const _feed = await handleDataComment(feed, loadComment)
  const data = await handleDataBeforeReturn(_feed)

  if (data.permission === "workspace") {
    const workspaceId = []
    data.permission_ids.map((workspaceIdItem) => {
      if (workspaceIdItem.match(/^[0-9a-fA-F]{24}$/)) {
        workspaceId.push(workspaceIdItem)
      }
    })
    data.permission_ids = await workspaceMongoModel
      .find({
        _id: { $in: workspaceId }
      })
      .select("_id name cover_image type")
  }

  // check data link
  let dataLink = {}
  if (data.type === "announcement") {
    dataLink = await handleGetAnnouncementById(data.link_id)
  }
  if (data.type === "event") {
    dataLink = await handleGetEventById(data.link_id)
  }
  if (data.type === "endorsement") {
    dataLink = await handleGetEndorsementById(data.link_id)
  }
  data["dataLink"] = dataLink

  return data
}

const handleSendNotification = async (
  userId,
  receivers,
  body,
  link = "#",
  id_post = ""
) => {
  if (!isEmpty(receivers)) {
    let _receivers = receivers
    if (id_post) {
      const data_feed = await feedMongoModel.findById(id_post)
      if (data_feed) {
        const turn_off_notification = data_feed.turn_off_notification
        if (!isEmpty(turn_off_notification)) {
          _receivers = receivers.filter(
            (x) => !turn_off_notification.includes(x.toString())
          )
        }
      }
    }

    sendNotification(
      userId,
      _receivers,
      {
        title: "",
        body: body,
        link: link
        //icon: icon
        //image: getPublicDownloadUrl("modules/chat/1_1658109624_avatar.webp")
      },
      {
        skipUrls: ""
      }
    )
  }

  return true
}

const handleDataLoadFeed = async (page, pageLength, feed, feedCount) => {
  const promises = []
  forEach(feed, (value, key) => {
    const promise = new Promise(async (resolve, reject) => {
      const _value = await handleDataComment(value)

      // check data link
      let dataLink = {}
      if (_value.type === "announcement") {
        dataLink = await handleGetAnnouncementById(_value.link_id)
      }
      if (_value.type === "event") {
        dataLink = await handleGetEventById(_value.link_id)
      }
      if (_value.type === "endorsement") {
        dataLink = await handleGetEndorsementById(_value.link_id)
      }

      _value["dataLink"] = dataLink

      if (_value.permission === "workspace") {
        const workspaceId = []
        _value.permission_ids.map((workspaceIdItem) => {
          if (workspaceIdItem.match(/^[0-9a-fA-F]{24}$/)) {
            workspaceId.push(workspaceIdItem)
          }
        })
        _value.permission_ids = await workspaceMongoModel
          .find({
            _id: { $in: workspaceId }
          })
          .select("_id name cover_image")
      }

      resolve(_value)
    })
    promises.push(promise)
  })
  const _feed = await Promise.all(promises).then((res_promise) => {
    return res_promise
  })
  const data = await handleDataBeforeReturn(_feed, true)
  const result = {
    dataPost: data,
    totalPost: feedCount,
    page: page * 1 + 1,
    hasMore: (page * 1 + 1) * pageLength < feedCount
  }

  return result
}

const handleCurrentYMD = () => {
  const date_ob = new Date()
  const day = ("0" + date_ob.getDate()).slice(-2)
  const month = ("0" + (date_ob.getMonth() + 1)).slice(-2)
  const year = date_ob.getFullYear()
  const ymd = year + month + day
  return ymd
}

const handlePullHashtag = async (data_feed_old) => {
  // pull hashtag
  if (!isEmpty(data_feed_old.hashtag)) {
    const hashtag_promises = []
    forEach(data_feed_old.hashtag, (hashtag) => {
      const promise = new Promise(async (resolve, reject) => {
        await hashtagMongoModel.updateOne(
          {
            hashtag: hashtag
          },
          { $pull: { post_id: data_feed_old._id } }
        )

        resolve("success")
      })
      hashtag_promises.push(promise)
    })
    await Promise.all(hashtag_promises)
      .then((res) => {})
      .catch((err) => {})
  }
}

const handleInsertHashTag = async (arrHashtag, userId, idPost) => {
  // insert hashtag
  if (!isEmpty(arrHashtag)) {
    const hashtag_promises = []
    forEach(arrHashtag, (hashtag) => {
      const promise = new Promise(async (resolve, reject) => {
        const check_hashtag = await hashtagMongoModel.findOne({
          hashtag: hashtag
        })
        if (check_hashtag) {
          await hashtagMongoModel.updateOne(
            {
              hashtag: hashtag
            },
            { $push: { post_id: idPost } }
          )
        } else {
          const insertHashtag = new hashtagMongoModel({
            __user: userId,
            hashtag: hashtag,
            post_id: [idPost]
          })
          await insertHashtag.save()
        }

        resolve("success")
      })
      hashtag_promises.push(promise)
    })
    await Promise.all(hashtag_promises)
      .then((res) => {})
      .catch((err) => {})
  }
}

const handleDataHistory = (
  userId,
  data_new,
  data_old,
  field_compare,
  data_save = {}
) => {
  const data_history = {}
  forEach(field_compare, (field) => {
    // post
    if (field === "medias") {
      const check_different = differentCompare2ArrayValueObject(
        data_new[field],
        data_old[field],
        "_id"
      )
      if (check_different) {
        data_history[field] = data_old[field]
      }
      return
    }
    if (field === "tag_user") {
      const check_different = differentCompare2Array(
        data_new[field]["tag"],
        data_old[field]["tag"]
      )
      if (check_different) {
        data_history[field] = data_old[field]
      }
      return
    }
    if (field === "poll_vote_detail") {
      const check_different = differentCompare2Object(
        data_new[field],
        data_old[field],
        "question"
      )
      const check_different2 = differentCompare2Object(
        data_new[field],
        data_old[field],
        "time_end"
      )
      const check_different3 = differentCompare2ArrayValueObject(
        data_new[field]["options"],
        data_old[field]["options"],
        "_id"
      )
      if (check_different || check_different2 || check_different3) {
        data_history[field] = data_old[field]
        data_history["has_poll_vote"] = true
      }
      return
    }

    // event
    if (field === "attendees") {
      const check_different = differentCompare2ArrayValueObject(
        data_new[field],
        data_old[field],
        "value"
      )
      if (check_different) {
        data_history[field] = data_old[field]
      }
      return
    }
    if (field === "meeting_room") {
      const check_different = differentCompare2Object(
        data_new[field],
        data_old[field],
        "value"
      )
      if (check_different) {
        data_history[field] = data_old[field]
      }
      return
    }

    // endorsement
    if (field === "member") {
      const check_different = differentCompare2Array(
        data_new[field],
        data_old[field]
      )
      if (check_different) {
        data_history[field] = data_old[field]
      }
      return
    }

    if (data_new[field] !== data_old[field]) {
      data_history[field] = data_old[field]

      if (field === "content" && data_old["hashtag"]) {
        data_history["hashtag"] = data_old["hashtag"]
      }

      if (field === "cover" && data_old["cover_type"]) {
        data_history["cover_type"] = data_old["cover_type"]
      }

      if (field === "badge" && data_old["badge_type"]) {
        data_history["badge_type"] = data_old["badge_type"]
      }
    }
  })

  if (!isEmpty(data_history)) {
    const edit_history = {
      ...data_history,
      created_by: data_old["created_by"],
      edited_at: Date.now(),
      edited_by: userId,
      ...data_save
    }
    return edit_history
  }

  return {}
}

const differentCompare2Array = (arr1 = [], arr2 = []) => {
  if (!isArray(arr1) || !isArray(arr2)) {
    return false
  }

  if (arr1.length === 0 && arr2.length === 0) {
    return false
  }

  if (arr1.length !== arr2.length) {
    return true
  }

  let check = false
  for (let index = 0; index < arr1.length; index++) {
    if (check === true) {
      return
    }

    if (arr1[index] !== arr2[index]) {
      check = true
    }
  }

  return check
}

const differentCompare2ArrayValueObject = (
  arr1 = [],
  arr2 = [],
  keyObjectCheck = ""
) => {
  if (!isArray(arr1) || !isArray(arr2)) {
    return false
  }

  if (arr1.length === 0 && arr2.length === 0) {
    return false
  }

  if (arr1.length !== arr2.length) {
    return true
  }

  if (keyObjectCheck === "") {
    return false
  }
  let check = false
  for (let index = 0; index < arr1.length; index++) {
    if (check === true) {
      return
    }

    if (arr1[index][keyObjectCheck] !== arr2[index][keyObjectCheck]) {
      check = true
    }
  }

  return check
}

const differentCompare2Object = (obj1 = {}, obj2 = {}, keyCheck) => {
  if (!isObject(obj1) || !isObject(obj2)) {
    return false
  }

  if (obj1[keyCheck] != obj2[keyCheck]) {
    return true
  }

  return false
}

const getPostPending = async (req, res) => {
  try {
    const filter = {
      permission: "default",
      approve_status: "pending"
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
const loadAnnouncementPost = async (req, res) => {
  try {
    const filter = {
      type: "announcement"
    }
    const postList = await feedMongoModel.find(filter).sort({
      _id: req.query.sort
    })
    const beforeReturn = await handleDataBeforeReturn(postList, true)
    let dataReturn = []
    const promises = []
    beforeReturn.map((value) => {
      const promise = new Promise(async (resolve, reject) => {
        const dataLink = await handleGetAnnouncementById(value.link_id)
        value.dataLink = dataLink
        resolve(value)
      })

      promises.push(promise)
    })

    const _data = await Promise.all(promises).then((res_promise) => {
      return res_promise
    })
    const one_week = await getOptionValue(
      "news",
      "show_announcements",
      "one_week"
    )
    const one_month = await getOptionValue(
      "news",
      "show_announcements",
      "one_month"
    )
    _data.map((value) => {
      if (value.dataLink?.pin === 1 || value.dataLink?.pin === "1") {
        const createDdate = moment(value.dataLink.created_at)
        const dateToday = moment()

        let numberDate = 1
        if (value.dataLink.show_announcements * 1 === one_week * 1) {
          numberDate = 7
        } else if (value.dataLink.show_announcements * 1 === one_month * 1) {
          numberDate = 30
        }
        if (createDdate.add(numberDate, "days").isSameOrAfter(dateToday)) {
          dataReturn.push(value)
        }
      }
    })

    return res.respond({
      results: dataReturn,
      recordsTotal: dataReturn.length
    })
  } catch (err) {
    return res.fail(err.message)
  }
}

export {
  uploadTempAttachmentController,
  submitPostController,
  loadFeedController,
  getFeedChild,
  getFeedById,
  updatePostReaction,
  getFeedByIdAndViewAllComment,
  loadFeedProfile,
  deletePost,
  updateContentMedia,
  handleDataFeedById,
  handleSendNotification,
  handleCurrentYMD,
  handleCompressImage,
  handleMoveFileTempToMain,
  updateSeenPost,
  sendNotificationUnseen,
  handlePullHashtag,
  handleInsertHashTag,
  handleDataLoadFeed,
  turnOffNotification,
  turnOffCommenting,
  handleDataHistory,
  getDataEditHistory,
  getPostPending,
  loadAnnouncementPost
}
