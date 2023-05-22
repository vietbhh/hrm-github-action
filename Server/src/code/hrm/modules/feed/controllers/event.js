import calendarMongoModel from "#app/models/calendar.mongo.js"
import { usersModel } from "#app/models/users.mysql.js"
import { _uploadServices } from "#app/services/upload.js"
import { forEach, isEmpty } from "lodash-es"
import path from "path"
import feedMongoModel from "../models/feed.mongo.js"
import { handleDataBeforeReturn } from "#app/utility/common.js"
import moment from "moment/moment.js"
import { sendNotification } from "#app/libraries/notifications/Notifications.js"

const submitEvent = async (req, res, next) => {
  const body = req.body
  const idEdit = body.idEvent
  const idPost = body.idPost

  const employee = []
  const department = []
  forEach(body.dataAttendees, (item) => {
    const value = item.value
    const value_arr = value.split("_")
    if (value_arr[1] === "employee") {
      employee.push({
        id: value_arr[0],
        status: "yes",
        dateUpdate: Date.now()
      })
    }
    if (value_arr[1] === "department") {
      department.push(value_arr[0])
    }
  })

  if (!isEmpty(department)) {
    const dataEmployeeDepartment = await usersModel.findAll({
      where: { department_id: department }
    })
    forEach(dataEmployeeDepartment, (item) => {
      const index = employee.findIndex((val) => val.id === item.id)
      if (index === -1) {
        employee.push({
          id: item.id,
          status: "yes",
          dateUpdate: Date.now()
        })
      }
    })
  }

  try {
    const reminder_date = handleReminderDate(
      body.start_time_date,
      body.start_time_time,
      body.reminder.value
    )

    const dataInsert = {
      __user: req.__user,
      name: body.event_name,
      color: body.color,
      start_time_date: body.start_time_date,
      start_time_time: body.switch_all_day ? null : body.start_time_time,
      end_time_date: body.end_time_date,
      end_time_time: body.switch_all_day ? null : body.end_time_time,
      all_day_event: body.switch_all_day,
      repeat: body.valueRepeat,
      employee: employee,
      attendees: body.dataAttendees,
      meeting_room: body.meeting_room,
      reminder: body.reminder.value,
      reminder_date: reminder_date,
      online_meeting: body.switch_online_meeting,
      details: body.details
    }

    if (!idEdit) {
      const eventModel = new calendarMongoModel(dataInsert)
      const saveEvent = await eventModel.save()
      const idEvent = saveEvent._id

      // ** insert feed
      const feedModel = new feedMongoModel({
        __user: req.__user,
        type: "event",
        link_id: idEvent
      })
      const out = await feedModel.save()
      await calendarMongoModel.updateOne({ _id: idEvent }, { id_post: out._id })

      // ** send notification
      const userId = req.__user
      const receivers = []
      const body = "{{modules.network.you_have_a_new_event}}"
      const link = `/posts/${out._id}`
      await sendNotification(
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

      const _out = await handleDataBeforeReturn(out)
      const result = { dataFeed: _out, idEvent: idEvent, dataLink: {} }
      return res.respond(result)
    } else {
      await calendarMongoModel.updateOne({ _id: idEdit }, dataInsert)

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

      const dataEvent = await calendarMongoModel.findById(idEdit)
      const result = {
        dataFeed: _dataFeed,
        idEvent: idEdit,
        dataLink: dataEvent
      }

      return res.respond(result)
    }
  } catch (err) {
    return res.fail(err.message)
  }
}

const submitEventAttachment = async (req, res, next) => {
  const body = req.body
  const file = req.files

  try {
    const idEvent = body.idEvent
    const storePath = path.join("modules", "event", idEvent)
    const promises = []
    const countAttachment = body.countAttachment ? body.countAttachment : 0
    for (let index = 0; index < countAttachment; index++) {
      const type = body[`file[${index}][type]`]
      const promise = new Promise(async (resolve, reject) => {
        if (body[`file[${index}][new]`]) {
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
            name: body[`file[${index}][name]`],
            size: body[`file[${index}][size]`],
            src: body[`file[${index}][src]`]
          }
          resolve(result)
        }
      })
      promises.push(promise)
    }

    const attachment = await Promise.all(promises).then((res) => {
      return res
    })

    await calendarMongoModel.updateOne(
      { _id: idEvent },
      {
        attachment: attachment
      }
    )
    return res.respond("success")
  } catch (err) {
    return res.fail(err.message)
  }
}

const getEventById = async (req, res, next) => {
  try {
    const id = req.params.id
    const data = await calendarMongoModel.findById(id)
    return res.respond(data)
  } catch (err) {
    return res.fail(err.message)
  }
}

const updateEventStatus = async (req, res, next) => {
  const user_id = req.__user
  const body = req.body
  const id = body.id
  const status = body.status

  try {
    await calendarMongoModel.updateOne(
      { _id: id, "employee.id": user_id },
      {
        $set: {
          "employee.$.status": status,
          "employee.$.dateUpdate": Date.now()
        }
      }
    )
    return res.respond("success")
  } catch (err) {
    return res.fail(err.message)
  }
}

// ** support function
const handleReminderDate = (date, time, reminder) => {
  let date_reminder = null

  if (time) {
    const _date = `${moment(date).format("YYYY-MM-DD")} ${moment(time).format(
      "HH:mm:ss"
    )}`

    if (reminder === "just_in_time") {
      date_reminder = date
    }

    if (reminder === "5_minutes_before") {
      date_reminder = moment(_date).subtract(5, "minutes")
    }

    if (reminder === "10_minutes_before") {
      date_reminder = moment(_date).subtract(10, "minutes")
    }

    if (reminder === "15_minutes_before") {
      date_reminder = moment(_date).subtract(15, "minutes")
    }

    if (reminder === "30_minutes_before") {
      date_reminder = moment(_date).subtract(30, "minutes")
    }

    if (reminder === "1_hour_before") {
      date_reminder = moment(_date).subtract(1, "hours")
    }

    if (reminder === "1_day_before") {
      date_reminder = moment(_date).subtract(1, "days")
    }
  }

  return date_reminder
}

export { submitEvent, submitEventAttachment, getEventById, updateEventStatus }
