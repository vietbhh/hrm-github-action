import { _uploadServices, localSavePath } from "#app/services/upload.js"
import { handleDataBeforeReturn } from "#app/utility/common.js"
import fs from "fs"
import { forEach, isEmpty } from "lodash-es"
import path from "path"
import commentMongoModel from "../models/comment.mongo.js"
import feedMongoModel from "../models/feed.mongo.js"
import {
  handleCompressImage,
  handleCurrentYMD,
  handleDataFeedById,
  handleMoveFileTempToMain,
  handleSendNotification
} from "./feed.js"
import { sendNotification } from "#app/libraries/notifications/Notifications.js"

// ** comment
const submitComment = async (req, res, next) => {
  const body = JSON.parse(req.body.body)
  const content = body.content
  const id_post = body.id_post
  const comment_more_count_original = body.comment_more_count_original
  const image = req.files !== null ? req.files.image : null
  const dataEditComment = body?.dataEditComment || {}
  const created_by = body.created_by
  const data_user = body.data_user

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

      // ** send notification
      if (req.__user.toString() !== created_by.toString()) {
        const userId = req.__user
        const receivers = created_by
        const body_noti =
          data_user.full_name +
          " {{modules.network.notification.commented_on_your_post}}"
        const link = `/posts/${id_post}`
        sendNotification(
          userId,
          receivers,
          {
            title: "",
            body: body_noti,
            link: link
            //icon: icon
            //image: getPublicDownloadUrl("modules/chat/1_1658109624_avatar.webp")
          },
          {
            skipUrls: ""
          }
        )
      }
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
  const created_by = body.created_by
  const data_user = body.data_user

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

      // ** send notification
      if (req.__user.toString() !== created_by.toString()) {
        const userId = req.__user
        const receivers = created_by
        const body_noti =
          data_user.full_name +
          " {{modules.network.notification.replied_on_your_comment}}"
        const link = `/posts/${id_post}`
        sendNotification(
          userId,
          receivers,
          {
            title: "",
            body: body_noti,
            link: link
            //icon: icon
            //image: getPublicDownloadUrl("modules/chat/1_1658109624_avatar.webp")
          },
          {
            skipUrls: ""
          }
        )
      }
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

// update reaction
const updateCommentReaction = async (req, res, next) => {
  const body = req.body
  const _id_post = body._id_post
  const _id_comment = body._id_comment
  const comment_more_count_original = body.comment_more_count_original
  const full_name = body.full_name
  const created_by = body.created_by
  const react_type = body.react_type
  const react_action = body.react_action
  try {
    await commentMongoModel.updateMany(
      { _id: _id_comment, "reaction.react_user": req.__user },
      { $pull: { "reaction.$.react_user": req.__user } }
    )
    if (react_action === "add") {
      const update = await commentMongoModel.updateOne(
        { _id: _id_comment, "reaction.react_type": react_type },
        { $push: { "reaction.$.react_user": req.__user } }
      )
      if (update.matchedCount === 0) {
        await commentMongoModel.updateOne(
          { _id: _id_comment },
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
        const receivers = created_by
        const body =
          full_name + " {{modules.network.notification.liked_your_comment}}"
        const link = `/posts/${_id_post}`
        sendNotification(
          userId,
          receivers,
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
    }

    const data = await handleDataFeedById(_id_post, comment_more_count_original)
    return res.respond(data)
  } catch (err) {
    return res.fail(err.message)
  }
}

const updateSubCommentReaction = async (req, res, next) => {
  const body = req.body
  const _id_post = body._id_post
  const _id_comment = body._id_comment
  const _id_sub_comment = body._id_sub_comment
  const comment_more_count_original = body.comment_more_count_original
  const full_name = body.full_name
  const created_by = body.created_by
  const react_type = body.react_type
  const react_action = body.react_action
  try {
    await commentMongoModel.updateMany(
      {
        _id: _id_comment,
        "sub_comment._id": _id_sub_comment,
        "sub_comment.reaction.react_user": req.__user
      },
      { $pull: { "sub_comment.$[i].reaction.$[].react_user": req.__user } },
      { arrayFilters: [{ "i._id": _id_sub_comment }] }
    )
    if (react_action === "add") {
      const data_comment = await commentMongoModel.findById(_id_comment)
      const index_sub_comment = data_comment.sub_comment.findIndex(
        (item) => item._id.toString() === _id_sub_comment.toString()
      )
      if (index_sub_comment !== -1) {
        const data_sub_comment = data_comment["sub_comment"][index_sub_comment]
        const index_reaction = data_sub_comment.reaction.findIndex(
          (val) => val.react_type === react_type
        )
        if (index_reaction !== -1) {
          await commentMongoModel.updateOne(
            {
              _id: _id_comment,
              "sub_comment._id": _id_sub_comment,
              "sub_comment.reaction.react_type": react_type
            },
            {
              $push: { "sub_comment.$[i].reaction.$[j].react_user": req.__user }
            },
            {
              arrayFilters: [
                { "i._id": _id_sub_comment },
                { "j.react_type": react_type }
              ]
            }
          )
        } else {
          await commentMongoModel.updateOne(
            { _id: _id_comment, "sub_comment._id": _id_sub_comment },
            {
              $push: {
                "sub_comment.$.reaction": {
                  react_type: react_type,
                  react_user: req.__user
                }
              }
            }
          )
        }
      }

      // ** send notification
      if (req.__user.toString() !== created_by.toString()) {
        const userId = req.__user
        const receivers = created_by
        const body =
          full_name + " {{modules.network.notification.liked_your_comment}}"
        const link = `/posts/${_id_post}`
        sendNotification(
          userId,
          receivers,
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
    }

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
    const type = image.mimetype
    if (type.includes("/gif")) {
      const result_image = await _uploadServices(storePath, [image])
      result["source"] = result_image.uploadSuccess[0].path
      result["source_attribute"] = result_image.uploadSuccess[0]
    } else {
      const image_name = Date.now() + "_" + Math.random() * 1000001 + ".webp"
      const image_path = path.join(storePathTemp, image_name)
      const image_source_webp = await handleCompressImage(image, image_path)
      const file_info = {
        source: image_source_webp,
        name_source: image_name,
        type: type
      }
      const result_image = await handleMoveFileTempToMain(
        file_info,
        storePathTemp,
        storePath
      )
      result["source"] = result_image.source
      result["source_attribute"] = result_image.source_attribute
    }
  }

  return result
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

export {
  submitComment,
  updateCommentReaction,
  submitCommentReply,
  updateSubCommentReaction,
  deleteComment,
  handleDataComment
}
