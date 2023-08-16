import calendarMongoModel from "#code/hrm/modules/calendar/models/calendar.mongo.js"
import { addEvent } from "../libraries/event/Event.js"
import { updateNotificationStatusAction } from "#app/libraries/notifications/Notifications.js"

const submitEvent = async (req, res, next) => {
  const addResult = await addEvent(req)

  if (addResult.success === false) {
    return res.fail(addResult.err)
  }

  return res.respond(addResult.result)
}

const getEventById = async (req, res, next) => {
  try {
    const id = req.params.id
    const data = await handleGetEventById(id)
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

    let msg = ""
    if (status === "yes") {
      msg = "Accepted"
    } else if (status === "no") {
      msg = "Declined"
    } else if (status === "maybe") {
      msg = "Maybe"
    }
    
    const result = await updateNotificationStatusAction(body?.notification_id, body?.notification_index, body?.notification_status, msg)

    return res.respond({
      notification_info: result
    })
  } catch (err) {
    return res.fail(err.message)
  }
}

// ** support function
const handleGetEventById = async (id) => {
  const data = await calendarMongoModel.findById(id)
  return data
}

export { submitEvent, getEventById, updateEventStatus, handleGetEventById }
