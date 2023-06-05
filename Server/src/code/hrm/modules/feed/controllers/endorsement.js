import { _uploadServices } from "#app/services/upload.js"
import { handleDataBeforeReturn } from "#app/utility/common.js"
import { forEach } from "lodash-es"
import path from "path"
import endorsementMongoModel from "../models/endorsement.mongo.js"
import feedMongoModel from "../models/feed.mongo.js"
import { sendNotification } from "#app/libraries/notifications/Notifications.js"

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
      date: body.date
    }

    let _id = idEdit
    let result = {
      dataFeed: {},
      dataLink: {}
    }
    if (!idEdit) {
      const endorsementModel = new endorsementMongoModel(dataInsert)
      const saveEndorsement = await endorsementModel.save()
      const idEndorsement = saveEndorsement._id

      // ** insert feed
      const feedModelParent = new feedMongoModel({
        __user: req.__user,
        type: "endorsement",
        link_id: idEndorsement
      })
      const feedData = await feedModelParent.save()
      await endorsementMongoModel.updateOne(
        { _id: idEndorsement },
        { id_post: feedData._id }
      )

      // ** send notification
      const userId = req.__user
      const body = "{{modules.network.notification.you_have_a_new_endorse}}"
      const link = `/posts/${feedData._id}`
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

      _id = idEndorsement
      const _feedData = await handleDataBeforeReturn(feedData)
      result = {
        dataFeed: _feedData,
        dataLink: {}
      }
    } else {
      await endorsementMongoModel.updateOne({ _id: idEdit }, dataInsert)

      let _dataFeed = {}
      if (idPost) {
        await feedMongoModel.updateOne(
          { _id: idPost },
          {
            edited: true,
            edited_at: Date.now()
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
    result.dataLink = dataEndorsement

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

// ** support function
const handleGetEndorsementById = async (id) => {
  const data = await endorsementMongoModel.findById(id)
  return data
}

export { submitEndorsement, getEndorsementById, handleGetEndorsementById }
