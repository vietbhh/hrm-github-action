import { sendNotification } from "#app/libraries/notifications/Notifications.js"
import calendarMongoModel from "#app/models/calendar.mongo.js"
import { getUserActivated } from "#app/models/users.mysql.js"
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
import { cloneDeep, forEach, isEmpty, union } from "lodash-es"
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
    } else {
      _id_parent = _id_post_edit
      data_feed_old = await feedMongoModel.findById(_id_parent)
      const data_edit_history = handleDataHistory(data_feed_old, req.__user)
      await feedMongoModel.updateOne(
        { _id: _id_post_edit },
        {
          ...dataInsert,
          edited: true,
          $push: { edit_history: data_edit_history }
        }
      )

      // pull hashtag
      await handlePullHashtag(data_feed_old)
    }

    // insert hashtag
    await handleInsertHashTag(body.arrHashtag, req.__user, _id_parent)

    // send notification
    if (!is_edit && body.approveStatus === "approved") {
      const receivers = union(mention, tag)
      const link_notification = `/posts/${_id_parent}`
      const userId = body.data_user.id
      const full_name = body.data_user.full_name
      const body_noti =
        "<strong>" +
        full_name +
        "</strong> {{modules.network.notification.tag_post}}"
      await handleSendNotification(
        userId,
        receivers,
        body_noti,
        link_notification,
        _id_parent
      )
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

      if (!is_edit) {
        const _out = await handleDataBeforeReturn(out)
        _out["dataLink"] = {}
        return res.respond(_out)
      } else {
        const _out = await handleDataFeedById(_id_parent)
        _out["dataLink"] = {}
        return res.respond(_out)
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

        if (!is_edit) {
          out = await feedMongoModel.findById(_id_parent)
          const _out = await handleDataBeforeReturn(out)
          _out["dataLink"] = {}
          return res.respond(_out)
        } else {
          const _out = await handleDataFeedById(_id_parent)
          _out["dataLink"] = {}
          return res.respond(_out)
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

        return Promise.all(promises).then(async (arr_id_child) => {
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

          if (!is_edit) {
            out = await feedMongoModel.findById(_id_parent)
            const _out = await handleDataBeforeReturn(out)
            _out["dataLink"] = {}
            return res.respond(_out)
          } else {
            const _out = await handleDataFeedById(_id_parent)
            _out["dataLink"] = {}
            return res.respond(_out)
          }
        })
      }
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
  const filter = { ref: null }
  const from = request.from
  const to = request.to
  const isFeaturedPost = request.is_featured_post
  const type = request.type

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
      filter["permission"] = {
        $in: ["only_me", "default"]
      }
    } else if (type === "workspace") {
      filter["permission"] = "workspace"
    }
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
  try {
    const data = await handleDataFeedById(id)
    return res.respond(data)
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
  try {
    await feedMongoModel.updateMany(
      { _id: id, "reaction.react_user": req.__user },
      { $pull: { "reaction.$.react_user": req.__user } }
    )
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

      // ** send notification
      if (req.__user.toString() !== created_by.toString()) {
        const userId = req.__user
        const receivers = [created_by]
        const body_noti =
          full_name + " {{modules.network.notification.liked_your_post}}"
        const link = `/posts/${id}`
        await handleSendNotification(userId, receivers, body_noti, link, id)
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
    let receivers = []
    if (permission === "default") {
      const dataUser = await getUserActivated()
      const arrIdUser = []
      forEach(dataUser, (item) => {
        arrIdUser.push(item.id.toString())
      })
      receivers = arrIdUser.filter((x) => !seen.includes(x))
    } else if (permission === "workspace") {
      if (!isEmpty(permission_ids)) {
        const dataWorkspace = await workspaceMongoModel.findById(
          permission_ids[0]
        )
        const members = []
        forEach(dataWorkspace.members, (item) => {
          members.push(item.toString())
        })
        receivers = members.filter((x) => !seen.includes(x))
      }
    } else if (permission === "employee") {
      receivers = permission_ids.filter((x) => !seen.includes(x))
    }

    if (!isEmpty(receivers)) {
      sendNotification(
        req.__user,
        receivers,
        {
          title: "",
          body: "{{modules.network.notification.notification_unseen}}",
          link: `/posts/${post_id}`
          //icon: icon
          //image: getPublicDownloadUrl("modules/chat/1_1658109624_avatar.webp")
        },
        {
          skipUrls: ""
        }
      )
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

    return res.respond(dataHistory)
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

const handleDataHistory = (data_old, userId) => {
  const _data_old_history = { ...data_old }
  let data_old_history = _data_old_history
  if (_data_old_history._doc) {
    data_old_history = _data_old_history._doc
  }
  if (_data_old_history.dataValues) {
    data_old_history = _data_old_history.dataValues
  }

  delete data_old_history.owner
  delete data_old_history.created_by
  delete data_old_history.created_at
  delete data_old_history.updated_by
  delete data_old_history.updated_at
  delete data_old_history.deleted_by
  delete data_old_history.deleted_at
  delete data_old_history.edited
  delete data_old_history.edit_history

  const edit_history = {
    ...data_old_history,
    edited_at: Date.now(),
    edited_by: userId
  }

  return edit_history
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
  getDataEditHistory
}
