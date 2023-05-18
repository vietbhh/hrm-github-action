import calendarMongoModel from "#app/models/calendar.mongo.js"
import { usersModel } from "#app/models/users.mysql.js"
import { _uploadServices } from "#app/services/upload.js"
import { forEach, isEmpty } from "lodash-es"
import path from "path"
import feedMongoModel from "../models/feed.mongo.js"

const submitEvent = async (req, res, next) => {
  const body = req.body

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
    const eventModel = new calendarMongoModel({
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
      department: department,
      meeting_room: body.meeting_room,
      reminder: body.reminder.value,
      online_meeting: body.switch_online_meeting,
      details: body.details
    })
    const saveEvent = await eventModel.save()
    const idEvent = saveEvent._id

    // ** insert feed
    const feedModel = new feedMongoModel({
      __user: req.__user,
      type: "event",
      link_id: idEvent
    })
    await feedModel.save()

    return res.respond(idEvent)
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
    forEach(file, (value, index) => {
      const type = body[index.replace("[file]", "[type]")]
      const promise = new Promise(async (resolve, reject) => {
        const resultUpload = await _uploadServices(storePath, [value])
        const result = {
          type: type,
          source: resultUpload.uploadSuccess[0].path,
          source_attribute: resultUpload.uploadSuccess[0]
        }
        resolve(result)
      })
      promises.push(promise)
    })
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

export { submitEvent, submitEventAttachment, getEventById }
