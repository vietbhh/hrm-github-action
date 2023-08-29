import path from "path"
import { _uploadServices } from "#app/services/upload.js"
import { forEach } from "lodash-es"
import dayjs from "dayjs"

const getCalendar = async (calendarMongoModel, userId, query = {}, condition = {}) => {
  const createdAtFrom =
    query["created_at_from"] !== undefined ? query["created_at_from"] : ""
  const createdAtTo =
    query["created_at_to"] !== undefined ? query["created_at_to"] : ""
  const color = query["color"] !== undefined ? query["color"] : ""
  const filter = {}
  if (createdAtFrom !== "" && createdAtTo !== "") {
    filter["start_time_date"] = {
      $gte: createdAtFrom + " 00:00:00",
      $lt: createdAtTo + " 23:59:59"
    }
  }

  if (color !== "" && color !== "all") {
    filter["color"] = { $regex: color, $options: "i" }
  }

  const listCalendar = await calendarMongoModel.find({
    ...filter,
    ...condition
  })
  const result = listCalendar.map((item) => {
    return {
      ...item._doc,
      color: item.color.replace("#", "", item.color)
    }
  })

  // ** get list all day event
  const arrAllDay = {}
  if (result.length > 0) {
    result.map((item, index) => {
      if (item.all_day_event === true) {
        const startDate = dayjs(item.start_time_date).format("YYYY-MM-DD")
        const eventInfo = {
          from_date: dayjs(item.start_time_date).format("YYYY-MM-DD"),
          to_date: dayjs(item.end_time_date).format("YYYY-MM-DD"),
          ...item
        }

        const itemPush = {
          start: startDate,
          end: startDate,
          allday: true,
          all_day_event: true,
          name: "All day",
          is_editable: false,
          is_viewable: false,
          list_event: [eventInfo]
        }

        if (arrAllDay[startDate] === undefined) {
          arrAllDay[startDate] = itemPush
        } else {
          arrAllDay[startDate]["list_event"].push(eventInfo)
        }

        result.splice(index, 1)
      }
    })
  }

  return {
    result: result,
    allDayEvent: arrAllDay
  }
}

const addCalendar = async (calendarMongoModel, userId, req) => {
  const file = req.files
  const body = JSON.parse(req.body.body)
  const idEdit = body.idEvent
  try {
    const dataInsert = {
      __user: userId,
      name: body.event_name,
      color: body.color.replace("#", ""),
      start_time_date: body.start_time_date,
      start_time_time: body.switch_all_day ? null : body.start_time_time,
      end_time_date: body.end_time_date,
      end_time_time: body.switch_all_day ? null : body.end_time_time,
      all_day_event: body.switch_all_day,
      details: body.details
    }

    let idEvent = idEdit
    if (!idEdit) {
      const eventModel = new calendarMongoModel(dataInsert)
      const saveEvent = await eventModel.save()
      idEvent = saveEvent._id
    } else {
      await calendarMongoModel.updateOne({ _id: idEdit }, dataInsert)
    }

    // attachment
    const storePath = path.join("modules", "event", idEvent.toString())
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

    const result = await calendarMongoModel.updateOne(
      { _id: idEvent },
      {
        attachment: attachment
      }
    )

    return {
      success: true,
      result: result
    }
  } catch (err) {
    return {
      success: false,
      err: err.message
    }
  }
}

const getDetailEvent = async (calendarMongoModel, id) => {
  try {
    const data = await calendarMongoModel.findById(id)
    data["color"] = data.color.replace("#", "")
    return data
  } catch (err) {
    return {}
  }
}

const getListEvent = async (calendarMongoModel, query) => {
  const from =
    query["from"] !== undefined ? query["from"] : dayjs().format("YYYY-MM-DD")
  const to =
    query["to"] !== undefined
      ? query["to"]
      : dayjs(from).add(1, "day").format("YYYY-MM-DD")

  const listEvent = await calendarMongoModel.find({
    start_time_date: {
      $gte: from + " 00:00:00",
      $lte: to + " 23:59:59"
    }
  })

  const result = {
    today: [],
    tomorrow: []
  }

  listEvent.map((item) => {
    const startDate = dayjs(item.start_time_date).format("YYYY-MM-DD")
    const newItem = {
      ...item._doc,
      color: item.color.replace("#", "", item.color)
    }
    if (startDate === from) {
      result.today.push(newItem)
    } else {
      result.tomorrow.push(newItem)
    }
  })

  return result
}

export { getCalendar, addCalendar, getDetailEvent, getListEvent }
