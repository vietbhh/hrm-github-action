import {
  copyFilesServices,
  localSavePath,
  moveFileFromServerToGCS,
  _uploadServices
} from "#app/services/upload.js"
import ffmpegPath from "@ffmpeg-installer/ffmpeg"
import ffprobePath from "@ffprobe-installer/ffprobe"
import FfmpegCommand from "fluent-ffmpeg"
import fs from "fs"
import { forEach, isEmpty } from "lodash-es"
import path from "path"
import feedMongoModel from "../models/feed.mongo.js"
import sharp from "sharp"
import { handleDataBeforeReturn } from "#app/utility/common.js"
import commentMongoModel from "../models/comment.mongo.js"
import { sendNotification } from "#app/libraries/notifications/Notifications.js"
import { getSetting } from "#app/services/settings.js"

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

  // check type_2
  let type_2 = null
  const save_poll_vote_detail = {}
  if (body.poll_vote === true) {
    type_2 = "poll_vote"

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

  try {
    let out = {}
    let _id_parent = ""
    let data_feed_old = {}

    if (!is_edit) {
      const feedModelParent = new feedMongoModel({
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
        tag_user: body.tag_user,
        background_image: body.backgroundImage,
        type_2: type_2,
        poll_vote_detail: save_poll_vote_detail
      })
      const saveFeedParent = await feedModelParent.save()
      _id_parent = saveFeedParent._id
      out = saveFeedParent
    } else {
      _id_parent = _id_post_edit
      data_feed_old = await feedMongoModel.findById(_id_parent)
      await feedMongoModel.updateOne(
        { _id: _id_post_edit },
        {
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
          tag_user: body.tag_user,
          background_image: body.backgroundImage,
          edited: true,
          edited_at: Date.now(),
          type_2: type_2,
          poll_vote_detail: save_poll_vote_detail
        }
      )
    }

    // send notification
    if (!is_edit && body.approveStatus === "approved") {
      const link_notification = `/posts/${_id_parent}`
      await handleSendNotification(
        "post",
        body.tag_user,
        body.data_user,
        link_notification
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
        return res.respond(_out)
      } else {
        const _out = await handleDataFeedById(_id_parent)
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
          return res.respond(_out)
        } else {
          const _out = await handleDataFeedById(_id_parent)
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
            return res.respond(_out)
          } else {
            const _out = await handleDataFeedById(_id_parent)
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
  if (request.idPostCreateNew !== "") {
    filter["_id"] = { $lt: request.idPostCreateNew }
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
        $or: [{ created_by: id_profile }, { tag_user: id_profile }]
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

// update post
const updatePost = async (req, res, next) => {
  const body = req.body
  const id = body._id
  const comment_more_count_original = body.comment_more_count_original
  const body_update = body.body_update
  try {
    await feedMongoModel.updateOne({ _id: id }, body_update)
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
        { content: content, edited: true, edited_at: Date.now() }
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
// **

// ** comment
const submitComment = async (req, res, next) => {
  const body = JSON.parse(req.body.body)
  const content = body.content
  const id_post = body.id_post
  const comment_more_count_original = body.comment_more_count_original
  const image = req.files !== null ? req.files.image : null
  const dataEditComment = body?.dataEditComment || {}

  try {
    const result = await handleUpImageComment(image, id_post)
    if (isEmpty(dataEditComment)) {
      // insert
      const commentModel = new commentMongoModel({
        __user: req.__user,
        post_id: id_post,
        content: content,
        image_source: result.source,
        image_source_attribute: result.source_attribute
      })
      const saveComment = await commentModel.save()
      await feedMongoModel.updateOne(
        { _id: id_post },
        { $push: { comment_ids: saveComment._id } }
      )
    } else {
      // update
      const data_update = { content: content }
      if (!dataEditComment.image) {
        data_update["image_source"] = result.source
        data_update["image_source_attribute"] = result.source_attribute
      }
      await commentMongoModel.updateOne(
        { _id: dataEditComment._id_comment },
        data_update
      )
      // xoa file
    }

    const dataFeed = await handleDataFeedById(
      id_post,
      comment_more_count_original
    )

    // send notification
    if (isEmpty(dataEditComment)) {
      let link_notification = `/posts/${id_post}`
      if (dataFeed.ref) {
        link_notification = `/posts/${dataFeed.ref}/${id_post}`
      }
      await handleSendNotification(
        "comment",
        body.tag_user,
        body.data_user,
        link_notification
      )
    }

    return res.respond(dataFeed)
  } catch (err) {
    return res.fail(err.message)
  }
}

const submitCommentReply = async (req, res, next) => {
  const body = JSON.parse(req.body.body)
  const content = body.content
  const id_post = body.id_post
  const id_comment_parent = body.id_comment_parent
  const comment_more_count_original = body.comment_more_count_original
  const image = req.files !== null ? req.files.image : null
  const dataEditComment = body?.dataEditComment || {}

  try {
    const result = await handleUpImageComment(image, id_post)
    if (isEmpty(dataEditComment)) {
      const dataSaveSubComment = {
        post_id: id_post,
        content: content,
        image_source: result.source,
        image_source_attribute: result.source_attribute,
        created_by: req.__user,
        updated_by: req.__user,
        created_at: Date.now()
      }

      await commentMongoModel.updateOne(
        { _id: id_comment_parent },
        { $push: { sub_comment: dataSaveSubComment } }
      )
    } else {
      // update
      const data_update = { "sub_comment.$.content": content }
      if (!dataEditComment.image || image) {
        data_update["sub_comment.$.image_source"] = result.source
        data_update["sub_comment.$.image_source_attribute"] =
          result.source_attribute
      }
      await commentMongoModel.updateOne(
        {
          _id: dataEditComment._id_comment,
          "sub_comment._id": dataEditComment._id_sub_comment
        },
        { $set: data_update }
      )
      // xoa file
    }

    const dataFeed = await handleDataFeedById(
      id_post,
      comment_more_count_original
    )

    // send notification
    if (isEmpty(dataEditComment)) {
      let link_notification = `/posts/${id_post}`
      if (dataFeed.ref) {
        link_notification = `/posts/${dataFeed.ref}/${id_post}`
      }
      await handleSendNotification(
        "comment",
        body.tag_user,
        body.data_user,
        link_notification
      )
    }

    return res.respond(dataFeed)
  } catch (err) {
    return res.fail(err.message)
  }
}

// update comment
const updateComment = async (req, res, next) => {
  const body = req.body
  const _id_post = body._id_post
  const _id_comment = body._id_comment
  const comment_more_count_original = body.comment_more_count_original
  const body_update = body.body_update
  try {
    await commentMongoModel.updateOne({ _id: _id_comment }, body_update)
    const data = await handleDataFeedById(_id_post, comment_more_count_original)
    return res.respond(data)
  } catch (err) {
    return res.fail(err.message)
  }
}

const updateSubComment = async (req, res, next) => {
  const body = req.body
  const _id_post = body._id_post
  const _id_comment = body._id_comment
  const _id_sub_comment = body._id_sub_comment
  const comment_more_count_original = body.comment_more_count_original
  const body_update = body.body_update
  try {
    await commentMongoModel.updateOne(
      { _id: _id_comment, "sub_comment._id": _id_sub_comment },
      { $set: { "sub_comment.$.reaction": body_update.reaction } }
    )
    const data = await handleDataFeedById(_id_post, comment_more_count_original)
    return res.respond(data)
  } catch (err) {
    return res.fail(err.message)
  }
}

// delete comment
const deleteComment = async (req, res, next) => {
  const body = req.body
  const _id_post = body._id_post
  const _id_comment = body._id_comment
  const _id_sub_comment = body._id_sub_comment
  const comment_more_count_original = body.comment_more_count_original

  try {
    if (_id_sub_comment === "") {
      // delete comment parent
      await commentMongoModel.deleteOne({ _id: _id_comment })
      // xoa file
      await feedMongoModel.updateOne(
        { _id: _id_post },
        { $pull: { comment_ids: _id_comment } }
      )
    } else {
      // delete comment sub
      await commentMongoModel.updateOne(
        { _id: _id_comment },
        { $pull: { sub_comment: { _id: _id_sub_comment } } }
      )
      // xoa file
    }
    const data = await handleDataFeedById(_id_post, comment_more_count_original)
    return res.respond(data)
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

const handleDeleteFile = (file) => {
  if (fs.existsSync(path.join(localSavePath, file.source))) {
    fs.unlinkSync(path.join(localSavePath, file.source))
  }
  if (
    file.type.includes("video/") &&
    fs.existsSync(path.join(localSavePath, file.thumb))
  ) {
    fs.unlinkSync(path.join(localSavePath, file.thumb))
  }

  return true
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

const handleDataComment = async (feed, loadComment = -1) => {
  const comment_ids = feed.comment_ids
  let comment_more_count = 0
  let comment_list = []
  let sub_comment_count = 0
  if (!isEmpty(comment_ids)) {
    if (loadComment === -1) {
      const id_comment_last = comment_ids[comment_ids.length - 1]
      const data_comment = await commentMongoModel.findById(id_comment_last)
      const _data_comment = await handleDataBeforeReturn(data_comment)
      const __data_comment = await handleDataSubComment(_data_comment)
      comment_more_count = comment_ids.length - 1
      comment_list.push(__data_comment)
    } else if (loadComment === 0) {
      const data_comment = await commentMongoModel.find({
        _id: { $in: comment_ids }
      })
      const _data_comment = await handleDataBeforeReturn(data_comment, true)
      const __data_comment = await handleDataSubComment(_data_comment, true)
      comment_more_count = 0
      comment_list = __data_comment
    } else {
      const key_filter = loadComment - 1
      const comment_ids_filter = comment_ids.filter((item, key) => {
        return key > key_filter
      })
      const data_comment = await commentMongoModel.find({
        _id: { $in: comment_ids_filter }
      })
      const _data_comment = await handleDataBeforeReturn(data_comment, true)
      const __data_comment = await handleDataSubComment(_data_comment, true)
      comment_more_count = comment_ids.length - comment_ids_filter.length
      comment_list = __data_comment
    }
  }
  forEach(comment_list, (item) => {
    sub_comment_count += item.sub_comment.length
  })
  const _feed = { ...feed }
  _feed["_doc"]["comment_more_count"] = comment_more_count
  _feed["_doc"]["comment_count"] = comment_ids.length + sub_comment_count
  _feed["_doc"]["comment_list"] = comment_list

  return _feed["_doc"]
}

const handleDataFeedById = async (id, loadComment = -1) => {
  const feed = await feedMongoModel.findById(id)
  const _feed = await handleDataComment(feed, loadComment)
  const data = await handleDataBeforeReturn(_feed)
  return data
}

const handleUpImageComment = async (image, id_post) => {
  const dateToDay = handleCurrentYMD()
  const storePathTemp = path.join("modules", "comment_temp")
  if (!fs.existsSync(path.join(localSavePath, storePathTemp))) {
    fs.mkdirSync(path.join(localSavePath, storePathTemp), { recursive: true })
  }
  const storePath = path.join("modules", "comment", id_post, dateToDay)

  const result = {
    source: null,
    source_attribute: {}
  }
  if (image) {
    const image_name = Date.now() + "_" + Math.random() * 1000001 + ".webp"
    const image_path = path.join(storePathTemp, image_name)
    const image_source_webp = await handleCompressImage(image, image_path)
    const file_info = {
      source: image_source_webp,
      name_source: image_name,
      type: image.mimetype
    }
    const result_image = await handleMoveFileTempToMain(
      file_info,
      storePathTemp,
      storePath
    )
    result["source"] = result_image.source
    result["source_attribute"] = result_image.source_attribute
  }

  return result
}

const handleDataSubComment = async (dataComment, multiData = false) => {
  const arrData = multiData ? dataComment : [dataComment]
  const promises = []
  forEach(arrData, (value) => {
    const promise = new Promise(async (resolve, reject) => {
      const _dataItem = { ...value }
      const dataSubComment = value.sub_comment
      const _dataSubComment = await handleDataBeforeReturn(dataSubComment, true)
      _dataItem["sub_comment"] = _dataSubComment

      resolve(_dataItem)
    })
    promises.push(promise)
  })

  const result = await Promise.all(promises).then((res_promise) => {
    return res_promise
  })

  return multiData ? result : result[0]
}

const handleSendNotification = async (
  type,
  tag_user,
  data_user,
  link = "#"
) => {
  if (!isEmpty(tag_user) && !isEmpty(data_user)) {
    const userId = data_user.id
    const full_name = data_user.full_name
    const lang = type === "post" ? "tag_post" : "tag_comment"
    const body =
      "<strong>" +
      full_name +
      "</strong> {{modules.network.notification." +
      lang +
      "}}"
    await sendNotification(
      userId,
      tag_user,
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

export {
  uploadTempAttachmentController,
  submitPostController,
  loadFeedController,
  getFeedChild,
  getFeedById,
  updatePost,
  submitComment,
  getFeedByIdAndViewAllComment,
  updateComment,
  submitCommentReply,
  updateSubComment,
  loadFeedProfile,
  deletePost,
  updateContentMedia,
  deleteComment
}
