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
import { isFile } from "#app/utility/handleData.js"
import {
  sendNotificationCommentPost,
  sendNotificationCommentPostTag,
  sendNotificationReactionCommentPost,
  sendNotificationRepliedCommentPost,
  sendNotificationTagInCommentPost
} from "../../workspace/controllers/notification.js"
import { getUser } from "#app/models/users.mysql.js"
import dayjs from "dayjs"

// ** comment
const submitComment = async (req, res, next) => {
  const body = JSON.parse(req.body.body)
  const content = body.content
  const id_post = body.id_post
  const comment_more_count_original = body.comment_more_count_original
  const dataEditComment = body?.dataEditComment || {}
  const created_by = body.created_by
  const data_user = body.data_user
  const image = req.files !== null ? req.files.image : null
  try {
    const result = await handleUpImageComment(image, id_post)
    if (
      isEmpty(dataEditComment) ||
      dataEditComment === "" ||
      dataEditComment === undefined
    ) {
      // insert
      const dataInsert = {
        __user: req.__user,
        post_id: id_post,
        content: content,
        image_source: result.source,
        image_source_attribute: result.source_attribute
      }
      if (req.body?.image) {
        dataInsert["image_source"] = req.body?.image
      }

      const commentModel = new commentMongoModel(dataInsert)
      const saveComment = await commentModel.save()
      const estimateOrder = dayjs().unix() * 2
      const infoPost = await feedMongoModel.findById(id_post)
      const updateData = { $push: { comment_ids: saveComment._id } }
      if (estimateOrder > infoPost?.order) {
        updateData["$set"] = { order: estimateOrder }
      }
      
      await feedMongoModel.updateOne({ _id: id_post }, { ...updateData })

      const arrUserNotReceivedNotification = isEmpty(
        infoPost.turn_off_notification
      )
        ? []
        : infoPost.turn_off_notification

      // ** send notification
      if (
        req.__user.toString() !== created_by.toString() &&
        !arrUserNotReceivedNotification.includes(created_by)
      ) {
        const receivers = [created_by]
        sendNotificationCommentPost(infoPost, data_user, content, receivers)
      }

      // send notification tag
      const turn_off_notification = infoPost.turn_off_notification
      turn_off_notification.push(data_user.id)
      const arrTag = infoPost.tag_user.tag
      const arrMention = infoPost.tag_user.mention
      const allTag = arrTag.concat(arrMention)
      const allTagCheckExist = [...new Set(allTag)]
      const allTagSend = allTagCheckExist.filter(
        (i) => !turn_off_notification.includes(i)
      )
      if (allTagSend.length > 0) {
        sendNotificationCommentPostTag(infoPost, data_user, content, allTagSend)
      }
    } else {
      // update
      const data_update = { content: content }
      data_update["image_source"] = dataEditComment.image
      if (image !== null) {
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

      const infoPost = { _id: id_post }
      sendNotificationTagInCommentPost(
        infoPost,
        data_user,
        content,
        body.tag_user
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
      if (req.body?.image) {
        dataSaveSubComment["image_source"] = req.body?.image
      }

      await commentMongoModel.updateOne(
        { _id: id_comment_parent },
        { $push: { sub_comment: dataSaveSubComment } }
      )

      // ** send notification
      if (req.__user.toString() !== created_by.toString()) {
        const receivers = [created_by]
        const infoComment = await commentMongoModel.findOne({
          _id: id_comment_parent
        })
        sendNotificationRepliedCommentPost(
          infoComment,
          data_user,
          "",
          receivers
        )
      }
    } else {
      // update
      const data_update = { "sub_comment.$.content": content }
      data_update["sub_comment.$.image_source"] = dataEditComment.image
      if (image !== null) {
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
      const userId = body.data_user.id
      const full_name = body.data_user.full_name
      const body_noti =
        "<strong>" +
        full_name +
        "</strong> {{modules.network.notification.tag_comment}}"
      await handleSendNotification(
        userId,
        body.tag_user,
        body_noti,
        link_notification,
        dataFeed.ref ? dataFeed.ref : id_post
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
        const receivers = [created_by]
        const infoComment = await commentMongoModel.findOne({
          _id: _id_comment
        })
        sendNotificationReactionCommentPost(
          infoComment,
          { id: userId, full_name: full_name },
          react_type,
          receivers
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
  const result = {
    source: null,
    source_attribute: {}
  }

  if (isFile(image)) {
    const dateToDay = handleCurrentYMD()
    const storePathTemp = path.join("modules", "comment_temp")
    if (!fs.existsSync(path.join(localSavePath, storePathTemp))) {
      fs.mkdirSync(path.join(localSavePath, storePathTemp), { recursive: true })
    }
    const storePath = path.join("modules", "comment", id_post, dateToDay)

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
