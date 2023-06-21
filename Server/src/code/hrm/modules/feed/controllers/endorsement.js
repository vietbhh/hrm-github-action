import { sendNotification } from "#app/libraries/notifications/Notifications.js"
import { _uploadServices } from "#app/services/upload.js"
import { handleDataBeforeReturn } from "#app/utility/common.js"
import { forEach, isEmpty } from "lodash-es"
import path from "path"
import endorsementMongoModel from "../models/endorsement.mongo.js"
import feedMongoModel from "../models/feed.mongo.js"
import {
  handleDataHistory,
  handleDataLoadFeed,
  handleInsertHashTag,
  handlePullHashtag
} from "./feed.js"

const submitEndorsement = async (req, res, next) => {
  const file = req.files
  const body = JSON.parse(req.body.body)
  const idEdit = body.idEndorsement
  const idPost = body.idPost

  try {
    const member = []
    const receivers = []
    forEach(body.valueSelectMember, (item) => {
      const value = item.value
      member.push(value)

      if (req.__user.toString() !== value.toString()) {
        receivers.push(value)
      }
    })

    const dataInsert = {
      __user: req.__user,
      content: body.content,
      member: member,
      cover: body.activeCoverString,
      cover_type: body.cover_url === null ? "local" : "upload",
      badge: body.valueBadge.badge,
      badge_name: body.valueBadge.name,
      badge_type: body.valueBadge.badge_type,
      date: body.date,
      hashtag: body.arrHashtag
    }

    let data_old = {}
    let _id = idEdit
    let result = {
      dataFeed: {},
      dataLink: {}
    }
    let _id_post = idPost
    if (!idEdit) {
      const endorsementModel = new endorsementMongoModel(dataInsert)
      const saveEndorsement = await endorsementModel.save()
      const idEndorsement = saveEndorsement._id

      // ** insert feed
      const feedModelParent = new feedMongoModel({
        __user: req.__user,
        type: "endorsement",
        link_id: idEndorsement,
        hashtag: body.arrHashtag
      })
      const feedData = await feedModelParent.save()
      _id_post = feedData._id
      await endorsementMongoModel.updateOne(
        { _id: idEndorsement },
        { id_post: feedData._id }
      )

      // ** send notification
      const userId = req.__user
      const bodyNoti = "{{modules.network.notification.you_have_a_new_endorse}}"
      const link = `/posts/${feedData._id}`
      sendNotification(
        userId,
        receivers,
        {
          title: "",
          body: bodyNoti,
          link: link
          //icon: icon
          //image: getPublicDownloadUrl("modules/chat/1_1658109624_avatar.webp")
        },
        {
          skipUrls: ""
        }
      )

      _id = idEndorsement
      const _feedData = await handleDataBeforeReturn(feedData)
      result = {
        dataFeed: _feedData,
        dataLink: {}
      }
    } else {
      data_old = await endorsementMongoModel.findById(idEdit)
      await endorsementMongoModel.updateOne({ _id: idEdit }, dataInsert)

      let _dataFeed = {}
      if (idPost) {
        // pull hashtag
        const dataFeedOld = await feedMongoModel.findById(idPost)
        await handlePullHashtag(dataFeedOld)

        await feedMongoModel.updateOne(
          { _id: idPost },
          {
            edited: true,
            hashtag: body.arrHashtag
          }
        )

        const dataFeed = await feedMongoModel.findById(idPost)
        _dataFeed = await handleDataBeforeReturn(dataFeed)
      }

      result = {
        dataFeed: _dataFeed,
        dataLink: {}
      }
    }

    // insert hashtag
    await handleInsertHashTag(body.arrHashtag, req.__user, _id_post)

    // upload image cover
    if (file !== null) {
      const storePath = path.join("modules", "endorsement", _id.toString())
      const promise = new Promise(async (resolve, reject) => {
        const resultUpload = await _uploadServices(storePath, [file[`file`]])
        resolve(resultUpload.uploadSuccess[0].path)
      })
      const cover = await promise.then((res) => {
        return res
      })
      await endorsementMongoModel.updateOne(
        { _id: _id },
        {
          cover: cover,
          cover_type: "upload"
        }
      )
    }

    const dataEndorsement = await endorsementMongoModel.findById(_id)

    if (idEdit && idPost) {
      // update history
      const field_compare = [
        "content",
        "member",
        "cover",
        "cover_type",
        "badge",
        "badge_name",
        "badge_type"
      ]
      const data_edit_history = handleDataHistory(
        req.__user,
        dataEndorsement,
        data_old,
        field_compare,
        { type: "endorsement" }
      )
      if (!isEmpty(data_edit_history)) {
        await feedMongoModel.updateOne(
          { _id: idPost },
          {
            $push: { edit_history: data_edit_history }
          }
        )
      }
    }

    result.dataLink = dataEndorsement
    result.dataFeed.dataLink = dataEndorsement

    return res.respond(result)
  } catch (err) {
    return res.fail(err.message)
  }
}

const getEndorsementById = async (req, res, next) => {
  const id = req.params.id
  try {
    const data = await handleGetEndorsementById(id)
    return res.respond(data)
  } catch (err) {
    return res.fail(err.message)
  }
}

const getEmployeeEndorsement = async (req, res, next) => {
  try {
    const employeeId = req.params.id
    const data = await endorsementMongoModel.find({ member: employeeId })
    const result = {}
    forEach(data, (item) => {
      if (result[item.badge_name]) {
        result[item.badge_name]["count"] = result[item.badge_name]["count"] + 1
      } else {
        result[item.badge_name] = {
          badge: item.badge,
          badge_name: item.badge_name,
          badge_type: item.badge_type,
          count: 1
        }
      }
    })
    const sortable = Object.entries(result)
      .sort(([, a], [, b]) => b.count - a.count)
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {})
    return res.respond(sortable)
  } catch (err) {
    return res.fail(err.message)
  }
}

const loadFeedEndorsement = async (req, res, next) => {
  const request = req.query
  const page = request.page
  const pageLength = request.pageLength
  const employeeId = request.employeeId
  const filter = { member: employeeId }
  try {
    const endorsement = await endorsementMongoModel
      .find(filter)
      .skip(page * pageLength)
      .limit(pageLength)
      .sort({
        _id: "desc"
      })
    const feedCount = await endorsementMongoModel.find(filter).count()
    const feed_id = []
    forEach(endorsement, (item) => {
      if (item.id_post) {
        feed_id.push(item.id_post)
      }
    })
    if (!isEmpty(feed_id)) {
      const feed = await feedMongoModel.find({
        _id: {
          $in: feed_id
        }
      })
      const result = await handleDataLoadFeed(page, pageLength, feed, feedCount)
      return res.respond(result)
    }

    return res.fail("empty")
  } catch (err) {
    return res.fail(err.message)
  }
}

// ** support function
const handleGetEndorsementById = async (id) => {
  const data = await endorsementMongoModel.findById(id)
  return data
}

export {
  submitEndorsement,
  getEndorsementById,
  handleGetEndorsementById,
  getEmployeeEndorsement,
  loadFeedEndorsement
}
