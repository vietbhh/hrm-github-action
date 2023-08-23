import calendarMongoModel from "#code/hrm/modules/calendar/models/calendar.mongo.js"
import { addEvent } from "../libraries/event/Event.js"
import { updateNotificationStatusAction } from "#app/libraries/notifications/Notifications.js"
import { removeFile as removeFileService } from "#app/services/upload.js"
import { getUser } from "#app/models/users.mysql.js"

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
    const owner = data.owner
    let isEditable = false
    let isOwner = false
    if (parseInt(owner) === parseInt(req.__user)) {
      isEditable = true
      isOwner = true
    } else if (
      employee.some((itemSome) => {
        return parseInt(itemSome.id) === parseInt(req.__user)
      })
    ) {
      isEditable = false
    }

    const ownerInfo = await getUser(data.owner)
    return res.respond({
      ...data._doc,
      is_editable: isEditable,
      is_owner: isOwner,
      info_owner: {
        label: ownerInfo?.full_name,
        username: ownerInfo?.username,
        avatar: ownerInfo?.avatar,
        email: ownerInfo?.email
      }
    })
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

    const result = await updateNotificationStatusAction(
      body?.notification_id,
      body?.notification_index,
      body?.notification_status,
      msg
    )

    return res.respond({
      notification_info: result
    })
  } catch (err) {
    return res.fail(err.message)
  }
}

const removeEvent = async (req, res) => {
  const user_id = req.__user
  const body = req.body
  const id = body.id

  try {
    await calendarMongoModel
      .find({
        _id: id,
        owner: user_id
      })
      .remove()

    return res.respond("success")
  } catch (err) {
    return res.fail(err.message)
  }
}

const removeFile = async (req, res) => {
  const id = req.params.id
  const body = req.body
  const file = body.file
  const path = file?.src
  try {
    await removeFileService(path)

    const infoEvent = await handleGetEventById(id)
    const newAttachment =
      infoEvent.attachment === null
        ? []
        : infoEvent.attachment.filter((item) => {
            return item.src !== path
          })

    await calendarMongoModel.updateOne(
      { _id: id },
      {
        $set: {
          attachment: newAttachment
        }
      }
    )

    return res.respond("success")
  } catch (err) {
    return res.fail(err.message)
  }
}

// ** support function
const handleGetEventById = async (id) => {
  const data = await calendarMongoModel.findById(id)
  return data
}

export {
  submitEvent,
  getEventById,
  updateEventStatus,
  handleGetEventById,
  removeEvent,
  removeFile
}
