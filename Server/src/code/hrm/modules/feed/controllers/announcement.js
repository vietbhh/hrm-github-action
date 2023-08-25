import { sendNotification } from "#app/libraries/notifications/Notifications.js"
import { getUserActivated } from "#app/models/users.mysql.js"
import { _uploadServices } from "#app/services/upload.js"
import { handleDataBeforeReturn } from "#app/utility/common.js"
import { forEach, isEmpty } from "lodash-es"
import path from "path"
import feedMongoModel from "../models/feed.mongo.js"
import { newsModel } from "../models/news.mysql.js"
import { handleDataHistory } from "./feed.js"

const submitAnnouncement = async (req, res, next) => {
  const file = req.files
  const body = JSON.parse(req.body.body)
  const idEdit = body.idAnnouncement
  const idPost = body.idPost

  const arrEmployeeAttendeesCheck = []
  const receivers = []
  const employee = []
  const department = []

  let checkIsAll = false
  forEach(body.dataAttendees, (item) => {
    if (item.value === "all") {
      checkIsAll = true
      return
    }
  })

  if (checkIsAll) {
    const listEmployee = await getUserActivated()
    forEach(listEmployee, (item) => {
      employee.push(item.id.toString())
      if (parseInt(item.id) !== parseInt(req.__user)) {
        receivers.push(item.id)
      }
    })
  } else {
    forEach(body.dataAttendees, (item) => {
      const value = item.value
      const value_arr = value.split("_")
      if (value_arr[1] === "employee") {
        arrEmployeeAttendeesCheck.push(value_arr[0].toString())
        employee.push(value_arr[0])

        if (req.__user.toString() !== value_arr[0].toString()) {
          receivers.push(value_arr[0])
        }
      }
      if (value_arr[1] === "department") {
        department.push(value_arr[0])
      }
    })

    if (!isEmpty(department)) {
      const dataEmployeeDepartment = await getUserActivated({
        department_id: department
      })
      forEach(dataEmployeeDepartment, (item) => {
        const index = employee.findIndex((val) => val.id === item.id)
        if (
          index === -1 &&
          arrEmployeeAttendeesCheck.indexOf(item.id.toString()) === -1
        ) {
          employee.push(item.id.toString())

          if (req.__user.toString() !== item.id.toString()) {
            receivers.push(item.id)
          }
        }
      })
    }
  }

  try {
    const dataInsert = {
      title: body.announcement_title,
      content: body.details,
      employee: JSON.stringify(employee),
      //department: JSON.stringify(department),
      pin: body.pin_to_top ? 1 : 0,
      show_announcements: body.valueShowAnnouncement,
      send_to: JSON.stringify(body.dataAttendees)
    }

    let data_old = {}
    let _id = idEdit
    let result = {
      dataFeed: {},
      dataLink: {}
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

      // ** send notification
      const userId = req.__user
      const body =
        "{{modules.network.notification.you_have_a_new_announcement}}"
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

      _id = idAnnouncement
      const _feedData = await handleDataBeforeReturn(feedData)
      result = {
        dataFeed: _feedData,
        dataLink: {}
      }
    } else {
      data_old = await newsModel.findByPk(idEdit)
      await newsModel.update(dataInsert, {
        where: {
          id: idEdit
        }
      })

      let _dataFeed = {}
      if (idPost) {
        const dataFeed = await feedMongoModel.findById(idPost)
        _dataFeed = await handleDataBeforeReturn(dataFeed)
      }

      result = {
        dataFeed: _dataFeed,
        dataLink: {}
      }
    }

    // cover image
    let cover_image = body.coverImage.src
    if (body.coverImage.image !== null) {
      const storePath = path.join("modules", "news_cover_image", _id.toString())
      const resultUploadCoverImage = await _uploadServices(storePath, [
        file[`coverImage[image]`]
      ])
      cover_image = resultUploadCoverImage.uploadSuccess[0].path
    }

    // attachment
    const storePath = path.join("modules", "news", _id.toString())
    const promises = []
    forEach(body.file, (item, index) => {
      const type = item.type
      const promise = new Promise(async (resolve, reject) => {
        if (item.new) {
          const resultUpload = await _uploadServices(storePath, [
            file[`file[${index}][file]`]
          ])
          const result = {
            type: type,
            name: resultUpload.uploadSuccess[0].name,
            size: resultUpload.uploadSuccess[0].size,
            src: resultUpload.uploadSuccess[0].path
          }
          resolve(result)
        } else {
          const result = {
            type: type,
            name: item.name,
            size: item.size,
            src: item.src
          }
          resolve(result)
        }
      })
      promises.push(promise)
    })
    const attachment = await Promise.all(promises).then((res) => {
      return res
    })
    await newsModel.update(
      { attachment: JSON.stringify(attachment), cover_image: cover_image },
      {
        where: {
          id: _id
        }
      }
    )

    const dataAnnouncement = await newsModel.findByPk(_id)

    if (idEdit && idPost) {
      // update history
      const field_compare = [
        "title",
        "pin",
        "show_announcements",
        "content",
        "send_to",
        "attachment"
      ]
      const data_edit_history = handleDataHistory(
        req.__user,
        dataAnnouncement,
        data_old,
        field_compare,
        { type: "announcement" }
      )
      if (!isEmpty(data_edit_history)) {
        await feedMongoModel.updateOne(
          { _id: idPost },
          {
            edited: true,
            $push: { edit_history: data_edit_history }
          }
        )
      }
    }

    dataAnnouncement.dataValues.send_to = JSON.parse(
      dataAnnouncement.dataValues.send_to
    )
    dataAnnouncement.dataValues.attachment = JSON.parse(
      dataAnnouncement.dataValues.attachment
    )
    result.dataLink = dataAnnouncement
    result.dataFeed.dataLink = dataAnnouncement

    return res.respond(result)
  } catch (err) {
    return res.fail(err.message)
  }
}

const getAnnouncementById = async (req, res, next) => {
  const id = req.params.id
  try {
    const data = await handleGetAnnouncementById(id)
    return res.respond(data)
  } catch (err) {
    return res.fail(err.message)
  }
}

// ** support function
const handleGetAnnouncementById = async (id) => {
  const data = await newsModel.findByPk(id)
  data.dataValues.send_to = JSON.parse(data.dataValues.send_to)
  data.dataValues.attachment = JSON.parse(data.dataValues.attachment)
  return data
}

export { submitAnnouncement, getAnnouncementById, handleGetAnnouncementById }
