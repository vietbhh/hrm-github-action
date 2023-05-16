import calendarMongoModel from "#app/models/calendar.mongo.js"
import { _uploadServices } from "#app/services/upload.js"
import { forEach } from "lodash-es"
import path from "path"
import feedMongoModel from "../models/feed.mongo.js"

const submitEvent = async (req, res, next) => {
  const body = req.body

  const attendees = []
  forEach(body.dataAttendees, (item) => {
    const value = item.value
    const value_arr = value.split("_")
    attendees.push({ id: value_arr[0], type: value_arr[1] })
  })

  const meeting_room = []
  forEach(body.meeting_room, (item) => {
    meeting_room.push(item.value)
  })

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
      attendees: attendees,
      meeting_room: meeting_room,
      reminder: body.reminder.value,
      online_meeting: body.switch_online_meeting,
      details: body.details
    })
    const saveEvent = await eventModel.save()
    const idEvent = saveEvent._id

    // ** insert feed
    const feedModelParent = new feedMongoModel({
      __user: req.__user,
      type: "event",
      id_event: idEvent
    })
    await feedModelParent.save()

    return res.respond(idEvent)
  } catch (err) {
    return res.fail(err.message)
  }
}

const submitEventAttachment = async (req, res, next) => {
  const body = req.body
  const file = req.files

  try {
    const storePath = path.join("modules", "event")
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
    const idEvent = body.idEvent
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

export { submitEvent, submitEventAttachment }
