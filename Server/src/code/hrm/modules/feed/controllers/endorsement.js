import calendarMongoModel from "#app/models/calendar.mongo.js"
import { _uploadServices } from "#app/services/upload.js"
import { handleDataBeforeReturn } from "#app/utility/common.js"
import { forEach } from "lodash-es"
import path from "path"
import endorsementMongoModel from "../models/endorsement.mongo.js"
import feedMongoModel from "../models/feed.mongo.js"

const submitEndorsement = async (req, res, next) => {
  const body = req.body
  const idEdit = body.idEndorsement
  const idPost = body.idPost

  try {
    const member = []
    forEach(body.valueSelectMember, (item) => {
      const value = item.value
      member.push(value)
    })

    const dataInsert = {
      __user: req.__user,
      content: body.content,
      member: member,
      cover: body.activeCoverString,
      cover_type: "local",
      badge: body.valueBadge.badge,
      badge_type: body.valueBadge.badge_type
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

      const _feedData = await handleDataBeforeReturn(feedData)
      const result = {
        dataFeed: _feedData,
        idEndorsement: idEndorsement,
        dataLink: {}
      }
      return res.respond(result)
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

      const dataEndorsement = await endorsementMongoModel.findById(idEdit)
      const result = {
        dataFeed: _dataFeed,
        idEndorsement: idEdit,
        dataLink: dataEndorsement
      }
      return res.respond(result)
    }
  } catch (err) {
    return res.fail(err.message)
  }
}

const submitEndorsementCover = async (req, res, next) => {
  const body = req.body
  const file = req.files

  try {
    const idEndorsement = body.idEndorsement
    const storePath = path.join("modules", "endorsement", idEndorsement)
    const promise = new Promise(async (resolve, reject) => {
      const resultUpload = await _uploadServices(storePath, [file[`file`]])
      resolve(resultUpload.uploadSuccess[0].path)
    })

    const cover = await promise.then((res) => {
      return res
    })

    await endorsementMongoModel.updateOne(
      { _id: idEndorsement },
      {
        cover: cover,
        cover_type: "upload"
      }
    )
    return res.respond("success")
  } catch (err) {
    return res.fail(err.message)
  }
}

const getEndorsementById = async (req, res, next) => {
  const id = req.params.id
  try {
    const data = await endorsementMongoModel.findByPk(id)
    return res.respond(data)
  } catch (err) {
    return res.fail(err.message)
  }
}

export { submitEndorsement, submitEndorsementCover, getEndorsementById }
