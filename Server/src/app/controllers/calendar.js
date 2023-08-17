import calendarMongoModel from "#app/models/calendar.mongo.js"
import {
  getCalendar,
  addCalendar,
  getDetailEvent,
  getListEvent
} from "#app/libraries/calendar/Calendar.js"
import { map } from "lodash-es"

const handleGetCalendar = async (req, res) => {
  const query = req.query
  const listCalendar = await getCalendar(calendarMongoModel, query)
  const arrAllDay = map(listCalendar.allDayEvent, (item) => {
    return item
  })
  const result = listCalendar.result.concat(arrAllDay)

  return res.respond({
    results: result
  })
}

const handleGetDetailEvent = async (req, res) => {
  const id = req.params.id
  const data = await getDetailEvent(calendarMongoModel, id)

  return res.respond({
    data: data
  })
}

const handleGetListEvent = async (req, res) => {
  const query = req.query
  const result = await getListEvent(calendarMongoModel, query)

  return res.respond({
    results: result
  })
}

const handleAddCalendar = async (req, res) => {
  const resultAdd = await addCalendar(calendarMongoModel, req.userId, req)
  if (resultAdd.success === false) {
    return res.fail(resultAdd.err)
  }

  return res.respond({
    result: resultAdd.result
  })
}

export {
  handleGetCalendar,
  handleAddCalendar,
  handleGetDetailEvent,
  handleGetListEvent
}
