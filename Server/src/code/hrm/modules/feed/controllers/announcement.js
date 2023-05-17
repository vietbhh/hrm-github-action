import { _uploadServices } from "#app/services/upload.js"
import { forEach } from "lodash-es"
import path from "path"
import feedMongoModel from "../models/feed.mongo.js"
import { newsModel } from "../models/news.mysql.js"

const submitAnnouncement = async (req, res, next) => {
  const body = req.body

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
    const announcement = await newsModel.create(
      {
        title: body.announcement_title,
        content: body.details,
        employee: JSON.stringify(employee),
        department: JSON.stringify(department),
        pin: body.pin_to_top ? 1 : 0,
        show_announcements: body.valueShowAnnouncement
      },
      { __user: req.__user }
    )
    const idAnnouncement = announcement.id

    // ** insert feed
    const feedModelParent = new feedMongoModel({
      __user: req.__user,
      type: "announcement",
      link_id: idAnnouncement
    })
    await feedModelParent.save()

    return res.respond(idAnnouncement)
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
  console.log("_______________________________________________________")
  console.log(id)

  try {
    const data = await newsModel.findByPk(id)
    console.log(data)
  } catch (err) {
    return res.fail(err.message)
  }
  return res.fail("err.message")
}

export { submitAnnouncement, submitAnnouncementAttachment, getAnnouncementById }
