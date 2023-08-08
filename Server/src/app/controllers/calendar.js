import calendarMongoModel from "#app/models/calendar.mongo.js"
import path from "path"
import { _uploadServices } from "#app/services/upload.js"
import { forEach } from "lodash-es"
import dayjs from "dayjs"

const handleGetCalendar = async (req, res) => {
  const listCalendar = await calendarMongoModel.find()
  const result = listCalendar.map((item) => {})

  return res.respond({
    results: listCalendar
  })
}

const handleAddCalendar = async (req, res) => {
  const file = req.files
  const body = JSON.parse(req.body.body)
  const idEdit = body.idEvent
  
  try {
    const dataInsert = {
      __user: req.userId,
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
      const data_old = await calendarMongoModel.findById(idEdit)
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

    return res.respond({
      result: result
    })
  } catch (err) {
    return res.fail(err.message)
  }
}

const handleGetDetailEvent = async (req, res) => {
  const id = req.params.id
  const data = await calendarMongoModel.findById(id)
  return res.respond({
    data: data
  })
}

const handleGetListEvent = async (req, res) => {
  const query = req.query
  const from = query["from"] !== undefined ? query["from"] : dayjs().format("YYYY-MM-DD")
	const to = query["to"] !== undefined ? query["to"] : dayjs(from).add(1, 'day').format("YYYY-MM-DD")

  const listEvent = await calendarMongoModel.find({
    "start_time_date": {
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
    if (startDate === from) {
      result.today.push(item)
    } else {
      result.tomorrow.push(item)
    }
  })

  return res.respond({
    results: result
  })
}

export { handleGetCalendar, handleAddCalendar, handleGetDetailEvent, handleGetListEvent }
