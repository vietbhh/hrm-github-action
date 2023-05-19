import { _uploadServices } from "#app/services/upload.js"
import { forEach } from "lodash-es"
import path from "path"
import feedMongoModel from "../models/feed.mongo.js"
import { newsModel } from "../models/news.mysql.js"
import { handleDataBeforeReturn } from "#app/utility/common.js"

const submitAnnouncement = async (req, res, next) => {
  const body = req.body
  const idEdit = body.idAnnouncement
  const idPost = body.idPost

  const employee = []
  const department = []
  forEach(body.dataAttendees, (item) => {
    const value = item.value
    const value_arr = value.split("_")
    if (value_arr[1] === "employee") {
      employee.push(value_arr[0])
    }
    if (value_arr[1] === "department") {
      department.push(value_arr[0])
    }
  })

  try {
    const dataInsert = {
      title: body.announcement_title,
      content: body.details,
      employee: JSON.stringify(employee),
      department: JSON.stringify(department),
      pin: body.pin_to_top ? 1 : 0,
      show_announcements: body.valueShowAnnouncement,
      send_to: JSON.stringify(body.dataAttendees)
    }

    if (!idEdit) {
      const announcement = await newsModel.create(dataInsert, {
        __user: req.__user
      })
      const idAnnouncement = announcement.id

      // ** insert feed
      const feedModelParent = new feedMongoModel({
        __user: req.__user,
        type: "announcement",
        link_id: idAnnouncement
      })
      const feedData = await feedModelParent.save()
      await newsModel.update(
        { id_post: feedData._id.toString() },
        {
          where: {
            id: idAnnouncement
          }
        }
      )

      const _feedData = await handleDataBeforeReturn(feedData)
      const result = {
        dataFeed: _feedData,
        idAnnouncement: idAnnouncement,
        dataLink: {}
      }
      return res.respond(result)
    } else {
      await newsModel.update(dataInsert, {
        where: {
          id: idEdit
        }
      })

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

      const dataAnnouncement = await newsModel.findByPk(idEdit)
      dataAnnouncement.dataValues.send_to = JSON.parse(
        dataAnnouncement.dataValues.send_to
      )
      const result = {
        dataFeed: _dataFeed,
        idAnnouncement: idEdit,
        dataLink: dataAnnouncement
      }
      return res.respond(result)
    }
  } catch (err) {
    return res.fail(err.message)
  }
}

const submitAnnouncementAttachment = async (req, res, next) => {
  const body = req.body
  const file = req.files

  try {
    const idAnnouncement = body.idAnnouncement
    const storePath = path.join("modules", "news", idAnnouncement)
    const promises = []
    forEach(file, (value, index) => {
      const type = body[index.replace("[file]", "[type]")]
      const promise = new Promise(async (resolve, reject) => {
        const resultUpload = await _uploadServices(storePath, [value])
        const result = {
          type: type,
          name: resultUpload.uploadSuccess[0].name
        }
        resolve(result)
      })
      promises.push(promise)
    })
    const attachment = await Promise.all(promises).then((res) => {
      return res
    })

    await newsModel.update(
      { attachment: JSON.stringify(attachment) },
      {
        where: {
          id: idAnnouncement
        }
      }
    )
    return res.respond("success")
  } catch (err) {
    return res.fail(err.message)
  }
}

const getAnnouncementById = async (req, res, next) => {
  const id = req.params.id
  try {
    const data = await newsModel.findByPk(id)
    data.dataValues.send_to = JSON.parse(data.dataValues.send_to)
    return res.respond(data)
  } catch (err) {
    return res.fail(err.message)
  }
}

export { submitAnnouncement, submitAnnouncementAttachment, getAnnouncementById }
